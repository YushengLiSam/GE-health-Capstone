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
    categories = data.get('categories', [])

    try:
        for category in categories:
            category_name = category['name']
            cursor = db1.cursor()
            cursor.execute(
                "INSERT INTO Categories (name) VALUES (%s)", (category_name,))
            category_id = cursor.lastrowid

            for subcategory in category.get('subcategories', []):
                subcategory_name = subcategory['name']
                cursor.execute(
                    "INSERT INTO Subcategories (category_id, name) VALUES (%s, %s)", (category_id, subcategory_name))
                subcategory_id = cursor.lastrowid

                for datapoint in subcategory.get('datapoints', []):
                    datapoint_name = datapoint['name']
                    # Ensure data type matches ENUM definition
                    data_type = datapoint['datatype'].lower()
                    is_mandatory = datapoint['isMandatory']
                    cursor.execute(
                        "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                        (subcategory_id, datapoint_name, data_type, is_mandatory)
                    )
                    datapoint_id = cursor.lastrowid

                    # If the data type is List, save the list items
                    if data_type == 'list':
                        list_items = datapoint.get('listItems', [])
                        for item in list_items:
                            cursor.execute(
                                "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                                (datapoint_id, item)
                            )

        db1.commit()
        
        return jsonify({"message": "Categories and related data added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
            # If no category name is provided, return all categories
            cursor.execute("SELECT * FROM Categories")
            categories = cursor.fetchall()

            # For each category, fetch related subcategories and datapoints
            for category in categories:
                category_id = category['id']
                cursor.execute(
                    "SELECT * FROM Subcategories WHERE category_id = %s", 
                    (category_id,)
                )
                subcategories = cursor.fetchall()

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
        cursor.execute(
            "DELETE FROM Datapoints WHERE subcategory_id IN (SELECT id FROM Subcategories WHERE category_id = (SELECT id FROM Categories WHERE name = %s))", 
            (category_name,)
        )

        # Now delete the subcategories
        cursor.execute("DELETE FROM Subcategories WHERE category_id = (SELECT id FROM Categories WHERE name = %s)", (category_name,))

        # Finally, delete the category
        cursor.execute("DELETE FROM Categories WHERE category_id = (SELECT id FROM Categories WHERE name = %s)", (category_name,))

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
            category['subcategories'] = subcategories

            for subcategory in subcategories:
                subcategory_id = subcategory['id']
                cursor.execute(
                    "SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
                datapoints = cursor.fetchall()
                subcategory['datapoints'] = datapoints

                for datapoint in datapoints:
                    datapoint_id = datapoint['id']
                    if datapoint['data_type'].lower() == 'list':
                        cursor.execute(
                            "SELECT * FROM ListValues WHERE datapoint_id = %s", (datapoint_id,))
                        list_items = cursor.fetchall()
                        datapoint['listItems'] = [item['value']
                                                  for item in list_items]

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
