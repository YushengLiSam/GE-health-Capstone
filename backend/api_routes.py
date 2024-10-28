from flask import Blueprint, jsonify, request
import mysql.connector

# Database connections
db1 = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="annotations"  # Annotation Builder database
)

db2 = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="static_annotation"  # Static operators database
)

# Create Blueprint for routes
api_routes = Blueprint('api_routes', __name__)

# Define routes in the blueprint
@api_routes.route('/')
def index():
    return jsonify({"message": "API is working!"})

# -------------------------
# POST /categories
# -------------------------

@api_routes.route('/categories', methods=['POST'])
def add_categories():
    data = request.json
    cursor = db1.cursor()
    # categories = data.get('categories', [])
    try:
        for category in data['categories']:
            # Insert category
            category_name = category['name'].strip()  # Remove any extra spaces
            cursor.execute("INSERT INTO categories (name) VALUES (%s)", (category_name,))
            category_id = cursor.lastrowid  # Get the last inserted ID

            for subcategory in category['subcategories']:
                # Insert subcategory
                subcategory_name = subcategory['name'].strip()
                cursor.execute("INSERT INTO subcategories (name, category_id) VALUES (%s, %s)", (subcategory_name, category_id))
                subcategory_id = cursor.lastrowid  # Get the last inserted ID

                for datapoint in subcategory['datapoints']:

                    datapoint_name = datapoint['name'].lower()
                    data_type = datapoint['datatype'].lower()
                    is_mandatory = datapoint['isMandatory']

                    cursor.execute(
                        "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                        (subcategory_id, datapoint_name, data_type, is_mandatory)
                    )
                    datapoint_id = cursor.lastrowid

                    print("Inserting datapoint:", datapoint)
                    # If the data type is List, save the list items
                    if data_type == 'list':
                        for item in datapoint['listItems']:
                            cursor.execute(
                                "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                                (datapoint_id, item)
                            )
        # Commit all changes
        db1.commit()
        return jsonify({"message": "Categories, subcategories, and datapoints added successfully."}), 201

    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400

# For fetching a specific category (provided through a JSON file with category name)

@api_routes.route('/get_category', methods=['POST'])
def get_category():
    data = request.json
    category_name = data.get('name')
    # If name is provided, fetch that specific category. Else, fetch all categories

    cursor = db1.cursor(dictionary=True)

    try:
        if category_name:
            cursor.execute("SELECT * FROM Categories WHERE name = %s", (category_name,))
            category = cursor.fetchone()

            if category is None:
                return jsonify({"error": "Category not found"}), 404

            # Fetch subcategories related to the category
            cursor.execute(
                "SELECT * FROM Subcategories WHERE category_id = %s", 
                (category['id'],)
            )
            subcategories = cursor.fetchall()

            # Fetch datapoints for each subcategory
            for subcategory in subcategories:
                subcategory_id = subcategory['id']
                cursor.execute(
                    "SELECT * FROM Datapoints WHERE subcategory_id = %s", 
                    (subcategory_id,)
                )
                datapoints = cursor.fetchall()
                subcategory['datapoints'] = datapoints

                # If data type is List, fetch list items
                for datapoint in datapoints:
                    datapoint_id = datapoint['id']
                    if datapoint['data_type'].lower() == 'list':
                        cursor.execute(
                            "SELECT * FROM ListValues WHERE datapoint_id = %s", 
                            (datapoint_id,)
                        )
                        list_items = cursor.fetchall()
                        datapoint['listItems'] = [item['value'] for item in list_items]

            category['subcategories'] = subcategories
            return jsonify(category), 200

        else:
            cursor.execute("SELECT * FROM Categories")
            categories = cursor.fetchall()
            for category in categories:
                category_id = category['id']
                cursor.execute(
                    "SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
                subcategories = cursor.fetchall()
                category['subcategories'] = [] # new

                for subcategory in subcategories:
                    subcategory_id = subcategory['id']
                    cursor.execute(
                        "SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
                    datapoints = cursor.fetchall()
                    subcategory['datapoints'] = []

                    for datapoint in datapoints:
                        datapoint_dict = {
                            'name': datapoint['name'],
                            'datatype': datapoint['data_type'],
                            'isMandatory': datapoint['is_mandatory']
                        }
                        datapoint_id = datapoint['id']
                        if datapoint['data_type'].lower() == 'list':
                            cursor.execute(
                                "SELECT * FROM ListValues WHERE datapoint_id = %s", (datapoint_id,))
                            list_items = cursor.fetchall()
                            datapoint['listItems'] = [item['value']
                                                  for item in list_items]
                        subcategory['datapoints'].append(datapoint_dict)
                category['subcategories'].append({
                        'name': subcategory['name'],  # Include the subcategory name
                        'datapoints': subcategory['datapoints']
                    })

            return jsonify({"categories": categories}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500        

# -----------------------
# DELETE /categories
# -----------------------
# Still working on this implementation

@api_routes.route('/categories', methods=['DELETE'])
def delete_category():
    data = request.json
    category_name = data.get('name')
    
    if not category_name:
        return jsonify({"error": "Category name is required"}), 400

    try:
        cursor = db1.cursor(dictionary=True)
        # First, delete the associated datapoints
        cursor.execute("DROP TEMPORARY TABLE IF EXISTS tmp_ids")
        cursor.execute("CREATE TEMPORARY TABLE tmp_ids AS SELECT id FROM Categories WHERE id = (SELECT id FROM Categories WHERE name = %s)", (category_name,))

        cursor.execute("DELETE FROM Categories WHERE id in (SELECT id FROM tmp_ids)")

        db1.commit()

        return jsonify({"message": "Category and its related data deleted successfully!"}), 200

    except Exception as e:
        db1.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500


# -------------------------
# GET /categories
# -------------------------

@api_routes.route('/categories', methods=['GET'])
def get_categories_with_details():
    try:
        cursor = db1.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Categories")
        categories = cursor.fetchall()
        for category in categories:
            category_id = category['id']
            cursor.execute(
                "SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
            subcategories = cursor.fetchall()
            category['subcategories'] = [] # new

            for subcategory in subcategories:
                subcategory_id = subcategory['id']
                cursor.execute(
                    "SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
                datapoints = cursor.fetchall()
                subcategory['datapoints'] = []

                for datapoint in datapoints:
                    datapoint_dict = {
                        'name': datapoint['name'],
                        'datatype': datapoint['data_type'],
                        'isMandatory': datapoint['is_mandatory']
                    }
                    datapoint_id = datapoint['id']
                    if datapoint['data_type'].lower() == 'list':
                        cursor.execute(
                            "SELECT * FROM ListValues WHERE datapoint_id = %s", (datapoint_id,))
                        list_items = cursor.fetchall()
                        datapoint['listItems'] = [item['value']
                                                  for item in list_items]
                    subcategory['datapoints'].append(datapoint_dict)
            category['subcategories'].append({
                    'name': subcategory['name'],  # Include the subcategory name
                    'datapoints': subcategory['datapoints']
                })

        return jsonify({"categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Still implementing add / delete / get functions for subcategories

# -------------------------
# GET /operands
# -------------------------


@api_routes.route('/operands', methods=['GET'])
def get_operands():
    try:
        cursor = db2.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Symbols")
        symbols = cursor.fetchall()
        return jsonify({"symbols": symbols}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
