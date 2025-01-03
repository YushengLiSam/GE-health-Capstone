from flask import Blueprint, jsonify, request
import mysql.connector
import json
import os
from flask_cors import CORS
import bcrypt



# Database connections
db1 = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "mysql"),  # Use "mysql" instead of "localhost" for Docker
    user=os.getenv("MYSQL_USER", "annotation_user"),
    password=os.getenv("MYSQL_PASSWORD", "password"),
    database=os.getenv("MYSQL_DATABASE", "annotations")  # Database name
)

# db1 = mysql.connector.connect(
#    host="localhost",
#    user="annotation_user",
#    password="password",
#    database="annotations"  # Annotation Builder database
# )

'''
db2 = mysql.connector.connect(
   host="localhost",
   user="annotation_user",
   password="",
   database="static_annotation"  # Static operators database
)
'''
'''
db3 = mysql.connector.connect(
   host="localhost",
   user="annotation_user",
   password="",
   database="static_categories"  # Static categories database
>>>>>>> feaf42f1946e4cf95a9c4254e142e7373652f8de
)
'''


# Create Blueprint for routes
api_routes = Blueprint('api_routes', __name__)
CORS(api_routes)


# Define routes in the blueprint

@api_routes.route('/')
def index():
   return jsonify({"message": "API is working!"})


HARDCODED_CATEGORIES = {
#    "Active Labor (5cm-8cm)": {
#        "subcategories": [
#            {
#                "name": "Vitals",
#                "datapoints": [
#                    {"name": "HR", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True},
#                    {"name": "Respirations", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True},
#                    {"name": "Blood Pressure", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True},
#                    {"name": "Pulse Ox", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True},
#                    {"name": "Temperature", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True}
#                ]
#            },
#            {
#                "name": "Pain Management",
#                "datapoints": [
#                    {"name": "Pain Level", "datatype": "List", "inputType": "Dropdown",
#                        "isMandatory": False, "listItems": ["Mild", "Moderate", "Severe"]}
#                ]
#            }
#        ]
#    },
#    "Pushing/Delivery": {
#        "subcategories": [
#            {
#                "name": "FHR",
#                "datapoints": [
#                    {"name": "FHR Reading", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True}
#                ]
#            },
#            {
#                "name": "Contractions",
#                "datapoints": [
#                    {"name": "Contraction Frequency", "datatype": "Numeric",
#                        "inputType": "Textbox", "isMandatory": True}
#                ]
#            }
#        ]
#    }
}

# -------------------------
# POST /categories
# -------------------------
# -------------------------
# POST /categories
# -------------------------
@api_routes.route('/categories', methods=['POST'])
def add_categories():
    data = request.json
    cursor = db1.cursor()
    try:
        # Validate input
        if not data or 'categories' not in data or 'user_id' not in data:
            return jsonify({"error": "Invalid input format. 'categories' and 'user_id' keys are required."}), 400

        user_id = data['user_id']
        response_messages = []

        for category in data['categories']:
            # Remove any extra spaces from category name
            category_name = category['name'].strip()
            
            # Insert category if not exists
            cursor.execute("SELECT id FROM Categories WHERE name = %s", (category_name,))
            result = cursor.fetchone()

            if result is not None:
                category_id = result[0]
                response_messages.append(f"Category '{category_name}' already exists.")
            else:
                cursor.execute("INSERT INTO Categories (name) VALUES (%s)", (category_name,))
                category_id = cursor.lastrowid
                response_messages.append(f"Category '{category_name}' added successfully.")

                # Add relationship to UserAnnotations table
                cursor.execute(
                    "INSERT INTO UserAnnotations (user_id, category_id) VALUES (%s, %s)",
                    (user_id, category_id)
                )
                response_messages.append(f"User '{user_id}' is associated with the category '{category_name}'.")

            # Process subcategories if provided
            if 'subcategories' in category:
                for subcategory in category['subcategories']:
                    subcategory_name = subcategory['name'].strip()
                    cursor.execute(
                        "SELECT id FROM Subcategories WHERE name = %s AND category_id = %s", 
                        (subcategory_name, category_id)
                    )
                    sub_result = cursor.fetchone()

                    if sub_result is not None:
                        subcategory_id = sub_result[0]
                        response_messages.append(f"Subcategory '{subcategory_name}' already exists under category '{category_name}'.")
                    else:
                        cursor.execute(
                            "INSERT INTO Subcategories (name, category_id) VALUES (%s, %s)", 
                            (subcategory_name, category_id)
                        )
                        subcategory_id = cursor.lastrowid
                        response_messages.append(f"Subcategory '{subcategory_name}' added successfully under category '{category_name}'.")

                    # Process datapoints if provided
                    if 'datapoints' in subcategory:
                        for datapoint in subcategory['datapoints']:
                            datapoint_name = datapoint['name'].strip()
                            data_type = datapoint['datatype'].lower()
                            input_type = datapoint['inputType'].lower()
                            is_mandatory = datapoint['isMandatory']
                            
                            cursor.execute(
                                "SELECT id FROM Datapoints WHERE name = %s AND subcategory_id = %s", 
                                (datapoint_name, subcategory_id)
                            )
                            dp_result = cursor.fetchone()

                            if dp_result is not None:
                                datapoint_id = dp_result[0]
                                response_messages.append(f"Datapoint '{datapoint_name}' already exists under subcategory '{subcategory_name}'.")
                            else:
                                cursor.execute(
                                    "INSERT INTO Datapoints (subcategory_id, name, data_type, input_type, is_mandatory) VALUES (%s, %s, %s, %s, %s)",
                                    (subcategory_id, datapoint_name, data_type, input_type, is_mandatory)
                                )
                                datapoint_id = cursor.lastrowid
                                response_messages.append(f"Datapoint '{datapoint_name}' added successfully under subcategory '{subcategory_name}'.")

                                # Insert list items if data type is 'list'
                                if data_type == 'list' and 'listItems' in datapoint:
                                    for item in datapoint['listItems']:
                                        cursor.execute(
                                            "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                                            (datapoint_id, item)
                                        )
                                    response_messages.append(f"List items for datapoint '{datapoint_name}' added successfully.")

        # Commit all changes
        db1.commit()
        return jsonify({"message": response_messages}), 200

    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400



# -------------------------
# GET /categories
# -------------------------
# Fetch all category names and ids




# -------------------------
# GET /categories
# -------------------------
# Fetch all category names and ids associated with the given user

@api_routes.route('/categories', methods=['GET'])
def get_categories():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        cursor = db1.cursor(dictionary=True)

        # Select categories associated with the given user_id from UserAnnotations table
        cursor.execute("""
            SELECT c.id, c.name
            FROM Categories c
            JOIN UserAnnotations ua ON c.id = ua.category_id
            WHERE ua.user_id = %s
        """, (user_id,))
        categories = cursor.fetchall()

        # Return the category id and name only
        return jsonify({"categories": categories}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





# -----------------------
# DELETE /categories
# -----------------------
@api_routes.route('/categories', methods=['DELETE'])
def delete_category():
    data = request.json
    category_id = data['id']
    user_id = data['user_id']

    if not category_id or not user_id:
        return jsonify({"error": "Category ID and User ID are required"}), 400

    try:
        cursor = db1.cursor(dictionary=True)

        # Verify if the user is associated with the category
        cursor.execute(
            "SELECT * FROM UserAnnotations WHERE category_id = %s AND user_id = %s",
            (category_id, user_id)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "User not authorized to delete this category or category does not exist"}), 403

        # Delete the specified category using the ID
        cursor.execute("DELETE FROM Categories WHERE id = %s", (category_id,))

        # Check if there are no more categories left
        cursor.execute("SELECT COUNT(*) AS category_count FROM Categories")
        result = cursor.fetchone()
        if result['category_count'] == 0:
            # Reset the AUTO_INCREMENT (id) value to 1
            cursor.execute("ALTER TABLE Categories AUTO_INCREMENT = 1")

        # Delete corresponding user annotation relation
        cursor.execute("DELETE FROM UserAnnotations WHERE category_id = %s AND user_id = %s", (category_id, user_id))

        db1.commit()

        # Return the remaining categories by calling the existing get_categories method
        return jsonify({"success": True}), 204


    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": f"Database error: {str(e)}"}), 600
    finally:
        cursor.close()




# -------------------------
# GET /categories
# -------------------------
# This returns all the categories in the database
@api_routes.route('/categories_details', methods=['GET'])
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
           category['subcategories'] = []  # new


           for subcategory in subcategories:
               subcategory_id = subcategory['id']
               cursor.execute(
                   "SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
               datapoints = cursor.fetchall()
               subcategory['datapoints'] = []


               for datapoint in datapoints:
                   datapoint_dict = {
                       'id': datapoint['id'],
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
       return jsonify({"error": str(e)}), 601




# ------------------------
# POST /subcategories
# ------------------------

# ------------------------
# POST /subcategories
# ------------------------
@api_routes.route('/subcategories', methods=['POST'])
def add_subcategories():
    data = request.json
    cursor = db1.cursor()
    response_messages = []

    try:
        # Validate input
        if not data or 'user_id' not in data or 'category' not in data:
            return jsonify({"error": "Invalid input format. 'user_id' and 'category' keys are required."}), 400

        user_id = data['user_id']
        category_name = data['category'].strip()

        # Check if category exists
        cursor.execute("SELECT id FROM categories WHERE name = %s", (category_name,))
        result = cursor.fetchone()
        if result is not None:
            category_id = result[0]
            response_messages.append(f"Category '{category_name}' already exists.")
        else:
            cursor.execute("INSERT INTO categories (name) VALUES (%s)", (category_name,))
            category_id = cursor.lastrowid
            response_messages.append(f"Category '{category_name}' added successfully.")

            # Add relationship to UserAnnotations table
            cursor.execute(
                "INSERT INTO UserAnnotations (user_id, category_id) VALUES (%s, %s)",
                (user_id, category_id)
            )
            response_messages.append(f"User '{user_id}' is associated with the new category '{category_name}'.")

        # Iterate over subcategories provided in the input
        for subcategory in data['subcategory']:
            subcategory_name = subcategory['name'].strip()

            # Check if subcategory exists specifically under the category
            cursor.execute("SELECT id FROM subcategories WHERE category_id = %s AND name = %s",
                           (category_id, subcategory_name))
            subcategory_result = cursor.fetchone()

            if subcategory_result is not None:
                subcategory_id = subcategory_result[0]
                response_messages.append(f"Subcategory '{subcategory_name}' already exists under category '{category_name}'.")
            else:
                # Insert subcategory if it does not exist
                cursor.execute("INSERT INTO subcategories (name, category_id) VALUES (%s, %s)",
                               (subcategory_name, category_id))
                subcategory_id = cursor.lastrowid
                response_messages.append(f"Subcategory '{subcategory_name}' added successfully under category '{category_name}'.")

                # Add relationship to UserAnnotations table for subcategory
                cursor.execute(
                    "INSERT INTO UserAnnotations (user_id, category_id) VALUES (%s, %s)",
                    (user_id, subcategory_id)
                )
                response_messages.append(f"User '{user_id}' is associated with the new subcategory '{subcategory_name}'.")

            # Process datapoints if provided
            if 'datapoints' in subcategory:
                for datapoint in subcategory['datapoints']:
                    datapoint_name = datapoint['name'].strip()
                    data_type = datapoint['datatype'].lower()
                    is_mandatory = datapoint['isMandatory']

                    # Check if datapoint already exists under the subcategory
                    cursor.execute("SELECT id FROM Datapoints WHERE subcategory_id = %s AND name = %s",
                                   (subcategory_id, datapoint_name))
                    dp_result = cursor.fetchone()
                    if dp_result is not None:
                        datapoint_id = dp_result[0]
                        response_messages.append(f"Datapoint '{datapoint_name}' already exists under subcategory '{subcategory_name}'.")
                    else:
                        cursor.execute("INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                                       (subcategory_id, datapoint_name, data_type, is_mandatory))
                        datapoint_id = cursor.lastrowid
                        response_messages.append(f"Datapoint '{datapoint_name}' added successfully under subcategory '{subcategory_name}'.")

                        # Insert list items if data type is 'list'
                        if data_type == 'list' and 'listItems' in datapoint:
                            for item in datapoint['listItems']:
                                cursor.execute("INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                                               (datapoint_id, item))
                            response_messages.append(f"List items for datapoint '{datapoint_name}' added successfully.")

        # Commit all changes
        db1.commit()
        return jsonify({"message": response_messages}), 200

    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 602




# ------------------------
# GET /subcategories
# ------------------------
# Return the subcategory with the subcategory_name, provided through a JSON File with the contents:"category_name":"<category_name>" "subcategory_name": "<subcategory_name>"


@api_routes.route('/subcategories', methods=['GET'])
def get_subcategories():
    category_id = request.args.get('category_id')
    category_name = request.args.get('category_name')
    # user_id = request.args.get('user_id')

    # if not user_id:
    #     return jsonify({"error": "User ID is required"}), 400

    try:
        cursor = db1.cursor(dictionary=True)

        # Determine the category_id either from provided ID or name
        if category_id:
            # Find the category by ID
            cursor.execute("SELECT id FROM Categories WHERE id = %s", (category_id,))
        elif category_name:
            # Find the category by name if ID is not provided
            cursor.execute("SELECT id FROM Categories WHERE name = %s", (category_name,))
        else:
            return jsonify({"error": "Either category ID or category name is required"}), 400

        category = cursor.fetchone()

        if not category:
            return jsonify({"error": "Category not found"}), 404

        category_id = category['id']

        # Verify if the user is associated with the category
        # cursor.execute(
        #     "SELECT * FROM UserAnnotations WHERE category_id = %s AND user_id = %s",
        #     (category_id, user_id)
        # )
        # user_category = cursor.fetchone()

        # if not user_category:
        #     return jsonify({"error": "User not authorized to access this category"}), 403

        # Find subcategories for the given category
        cursor.execute("SELECT id, name FROM Subcategories WHERE category_id = %s", (category_id,))
        subcategories = cursor.fetchall()

        for subcategory in subcategories:
            subcategory_id = subcategory['id']
            cursor.execute("SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
            datapoints = cursor.fetchall()

            # Prepare datapoints list
            subcategory['datapoints'] = []
            for datapoint in datapoints:
                datapoint_dict = {
                    'id': datapoint['id'],
                    'name': datapoint['name'],
                    'datatype': datapoint['data_type'],
                    'inputType': datapoint['input_type'],
                    'isMandatory': datapoint['is_mandatory']
                }
                datapoint_id = datapoint['id']
                # If the datapoint has a data type of 'list', retrieve associated list values
                if datapoint['data_type'].lower() == 'list':
                    cursor.execute("SELECT * FROM ListValues WHERE datapoint_id = %s", (datapoint_id,))
                    list_items = cursor.fetchall()
                    datapoint_dict['listItems'] = [item['value'] for item in list_items]

                subcategory['datapoints'].append(datapoint_dict)

        return jsonify({"subcategories": subcategories}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# -------------------------
# DELETE /subcategories
# -------------------------
# Deletes subcategory with JSON data in the same format as get_subcategory

@api_routes.route('/subcategories', methods=['DELETE'])
def delete_subcategories():
    data = request.json
    category_name = data.get('category_name')
    subcategory_name = data.get('subcategory_name')
    user_id = data.get('user_id')

    if not category_name or not subcategory_name or not user_id:
        return jsonify({"error": "Category name, subcategory name, and user ID are required"}), 400

    try:
        cursor = db1.cursor(dictionary=True)

        # Verify if the category exists
        cursor.execute("SELECT * FROM Categories WHERE name = %s", (category_name,))
        category = cursor.fetchone()
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        category_id = category['id']

        # Verify if the user is associated with the category
        cursor.execute(
            "SELECT * FROM UserAnnotations WHERE category_id = %s AND user_id = %s",
            (category_id, user_id)
        )
        user_category = cursor.fetchone()
        if not user_category:
            return jsonify({"error": "User not authorized to delete this subcategory"}), 403

        # Verify if the subcategory exists under the given category
        cursor.execute(
            "SELECT * FROM Subcategories WHERE category_id = %s AND name = %s",
            (category_id, subcategory_name)
        )
        subcategory = cursor.fetchone()
        if subcategory is None:
            return jsonify({"error": "Subcategory not found under the specified category"}), 404

        subcategory_id = subcategory['id']

        # Delete all datapoints under this subcategory
        cursor.execute("DELETE FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))

        # Delete the specified subcategory
        cursor.execute("DELETE FROM Subcategories WHERE id = %s AND category_id = %s", (subcategory_id, category_id))

        db1.commit()

        return jsonify({"message": f"Subcategory '{subcategory_name}' and its related data deleted successfully!"}), 200

    except Exception as e:
        db1.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 604



# ------------------------
# GET /static_categories
# ------------------------
# TODO: This method is not finished yet

@api_routes.route('/static_categories', methods=['GET'])
def get_static_categories_with_details():
   try:
       cursor = db3.cursor(dictionary=True)
       cursor.execute("SELECT * FROM Categories")
       categories = cursor.fetchall()
       for category in categories:
           category_id = category['id']
           cursor.execute(
               "SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
           subcategories = cursor.fetchall()
           category['subcategories'] = []  # new

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
       return jsonify({"error": str(e)}), 605

# -------------------------
# POST /signup
# data is given in json: { username: <username>, password: <password> }
# -------------------------
@api_routes.route('/signup', methods=['POST'])
def add_user():
    data = request.json
    cursor = db1.cursor()
    try:
        username = data['username']
        password = data['password']

        if not username:
            return jsonify({"Error": "Username is required"}), 400

        if not password:
            return jsonify({"Error": "Password is required"}), 400

        cursor.execute("SELECT user_id FROM User WHERE username = %s", (username,))
        user = cursor.fetchone()
        if user:
            return jsonify({"Error": "Username already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("INSERT INTO User (username, password) VALUES (%s, %s)", (username, hashed_password))
        db1.commit()

        # Retrieve the new user's ID
        cursor.execute("SELECT user_id FROM User WHERE username = %s", (username,))
        new_user_id = cursor.fetchone()[0]

        return jsonify({"message": "User created successfully", "userID": new_user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

        
# -------------------------
# POST /login
# data is given in same json format as above. Will check if login is successful (if user/password is in db)
# ------------------------
@api_routes.route('/login', methods=['POST'])
def login_user():
    data = request.json
    cursor = db1.cursor()
    try:
        username = data['username']
        password = data['password']

        if not username or not password:
            return jsonify({"Error": "Username and Password are required"}), 400

        cursor.execute("SELECT user_id, password FROM User WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "Invalid username or password"}), 400

        user_id, stored_password_hash = user
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            return jsonify({"Error": "Invalid username or password"}), 400

        return jsonify({"message": "Login successful", "username": username, "userID": user_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------
# POST /get_user
# Returns the user_id of the currently logged-in user (if needed for Annotation connection)
# data is given in json: {username: <username>}
# ------------------------
@api_routes.route('/get_user', methods=['POST'])
def get_curr_user():
    data = request.json
    cursor = db1.cursor()
    try:
        username = data['username']
        if not username:
            return jsonify({"Error": "Username is required"}), 400
        cursor.execute("SELECT user_id FROM User WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error":"Invalid username"}), 400
        return jsonify(user), 200

    except Exception as e:
        return jsonify({"error":str(e)}), 500

# ------------------------
# GET /get_user
# returns all user info in DB
# ------------------------
@api_routes.route('/get_user', methods=['GET'])
def get_all_users():
    cursor = db1.cursor()
    try:
        cursor.execute("SELECT user_id, username, password FROM User")
        user = cursor.fetchall()
        return jsonify(user), 200

    except Exception as e:
        return jsonify({"error":str(e)}), 500

# -------------------------
# POST /get_anno_id
# return the anno_id corresponding to input user_id
# json input: { user_id: <user_id> }
# ------------------------
@api_routes.route('/get_anno_id', methods=['POST'])
def get_anno_id():
    cursor = db1.cursor()
    data = request.json
    try:
        user_id = data['user_id']
        if not user_id:
            return jsonify({"Error": "User_id is required"}), 400
        cursor.execute("SELECT anno_id FROM Annotation WHERE user_id = %s", (user_id,))
        anno_id = cursor.fetchone()
        if not anno_id:
            return jsonify({"error":"Invalid user_id"}), 400
        return jsonify(anno_id), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

# ------------------------
# POST /update_anno_id
# update the anno_id for the current user
# json input: { user_id: <user_id>, anno_id: <anno_id>}
# -----------------------
@api_routes.route('/update_anno_id', methods=['POST'])
def update_anno_id():
    cursor = db1.cursor()
    data = request.json
    try:
        user_id = data['user_id']
        anno_id = data['anno_id']
        if not user_id or anno_id:
            return jsonify({"Error": "User_id and anno_id is required"}), 400
        query = """
        UPDATE Annotation 
        SET anno_id = %s 
        WHERE user_id = %s
        """
        cursor.execute(query, (anno_id, user_id))
        db1.commit()
        return jsonify({"message":"anno_id updated successfully"})

    except Exception as e:
        db1.rollback()
        return jsonify({"error":str(e)}), 500

# ------------------------
# POST /add_anno_id
# add anno_id (new annotation configuration) for given user
# json input: {user_id: <user_id>, anno_id:<anno_id>}
# ------------------------
@api_routes.route('/update_anno_id', methods=['POST'])
def add_anno_id():
    cursor = db1.cursor()
    data = request.json
    try:
        user_id = data['user_id']
        anno_id = data['anno_id']
        if not user_id or anno_id:
            return jsonify({"Error": "User_id and anno_id is required"}), 400
        query = """
        INSERT INTO Annotation (anno_id, user_id)
        VALUES (%s, %s)
        """
        cursor.execute(query, (anno_id, user_id))
        db1.commit()
        return jsonify({"message":"anno_id added successfully"})

    except Exception as e:
        db1.rollback()
        return jsonify({"error":str(e)}), 500

# -------------------------
# GET /operands
# -------------------------


# @api_routes.route('/operands', methods=['GET'])
# def get_operands():
#    try:
#        cursor = db2.cursor(dictionary=True)
#        cursor.execute("SELECT * FROM Symbols")
#        symbols = cursor.fetchall()
#        return jsonify({"symbols": symbols}), 200
#    except Exception as e:
#        return jsonify({"error": str(e)}), 606
@api_routes.route('/operands', methods=['GET'])
def get_operands():
   try:
       cursor = db1.cursor(dictionary=True)
       cursor.execute("SELECT * FROM Symbols")
       symbols = cursor.fetchall()
       return jsonify({"symbols": symbols}), 200
   except Exception as e:
       return jsonify({"error": str(e)}), 606


# ------------------------
# POST /patient_data
# ------------------------
"""
    Adds data for a specific patient.

    Expected JSON Input:
    {
        "patient_id": <patient_id>,
        "datapoint_id": <datapoint_id>,
        "data": "<data_value>"
    }
"""
# @api_routes.route('/patient_data', methods=['POST'])
# def add_patient_data():
#     data = request.json
#     cursor = db1.cursor()
#     try:
#         patient_id = data['patient_id']
#         datapoint_id = data['datapoint_id']
#         value = data['data']
        
#         cursor.execute(
#             "INSERT INTO PatientData (patient_id, datapoint_id, data) VALUES (%s, %s, %s)",
#             (patient_id, datapoint_id, value)
#         )
#         db1.commit()
#         return jsonify({"message": "Patient data added successfully."}), 200
#     except Exception as e:
#         db1.rollback()  # Rollback in case of error
#         return jsonify({"error": str(e)}), 400

@api_routes.route('/patient_data', methods=['POST'])
def add_patient_data():
    data = request.json  # Expecting an array of objects
    cursor = db1.cursor()
    try:
        for record in data:
            patient_id = record['patient_id']
            datapoint_id = record['datapoint_id']
            value = record['data']
            
            cursor.execute(
                "INSERT INTO PatientData (patient_id, datapoint_id, data) VALUES (%s, %s, %s)",
                (patient_id, datapoint_id, value)
            )
        db1.commit()  # Commit all records at once
        return jsonify({"message": "All patient data added successfully."}), 200
    except Exception as e:
        db1.rollback()  # Rollback in case of any error
        return jsonify({"error": str(e)}), 400

# ------------------------
# POST /datapoints
# ------------------------
"""
    Adds new datapoints for a specific subcategory.

    Expected JSON Input:
    {
        "subcategory_id": <subcategory_id>,
        "datapoints": [
            {"name": "<datapoint_name>", "datatype": "<datatype>", "isMandatory": <bool>, "listItems": [ ... ]}
        ]
    }
"""
# ------------------------
# POST /datapoints
# ------------------------
@api_routes.route('/datapoints', methods=['POST'])
def add_datapoint():
    data = request.json
    cursor = db1.cursor()
    response_messages = []

    try:
        # Validate input
        if not data or 'subcategory_id' not in data or 'name' not in data:
            return jsonify({"error": "Invalid input format. 'subcategory_id' and 'name' keys are required."}), 400

        subcategory_id = data['subcategory_id']
        name = data['name'].strip()
        data_type = data['data_type'].lower() if 'data_type' in data else None
        is_mandatory = data.get('is_mandatory', 0)

        # Check if the datapoint already exists in the given subcategory
        cursor.execute(
            "SELECT id FROM Datapoints WHERE subcategory_id = %s AND name = %s",
            (subcategory_id, name)
        )
        result = cursor.fetchone()

        if result is not None:
            response_messages.append(f"Datapoint '{name}' already exists under subcategory ID '{subcategory_id}'.")
        else:
            # Insert the new datapoint since it does not exist
            cursor.execute(
                "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                (subcategory_id, name, data_type, is_mandatory)
            )
            datapoint_id = cursor.lastrowid
            response_messages.append(f"Datapoint '{name}' added successfully under subcategory ID '{subcategory_id}'.")

            # Insert list items if data type is 'list'
            if data_type == 'list' and 'listItems' in data:
                for item in data['listItems']:
                    cursor.execute(
                        "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                        (datapoint_id, item)
                    )
                response_messages.append(f"List items for datapoint '{name}' added successfully.")

        # Commit changes
        db1.commit()
        return jsonify({"message": response_messages}), 200

    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400

# ------------------------
# POST /patients
# ------------------------
"""
    Adds new patient information to the database.

    Expected JSON Input:
    {
        "name": "<patient_name>",
        "age": <patient_age>,
        "bed_number": "<bed_number>",
        "dob": "<date_of_birth>",
        "fetal_count": <fetal_count>
    }

    Returns:
    {
        "message": "Patient added successfully.",
        "patient_id": <generated_patient_id>
    }
"""
@api_routes.route('/patients', methods=['POST'])
def add_patient():
    data = request.json
    cursor = db1.cursor()
    try:
        name = data['name'].strip()
        age = data['age']
        bed_number = data['bed_number'].strip()
        dob = data['dob'].strip()
        fetal_count = data['fetal_count']

        # insert patient info
        cursor.execute(
            "INSERT INTO PatientInformation (name, age, bed_number, dob, fetal_count) VALUES (%s, %s, %s, %s, %s)",
            (name, age, bed_number, dob, fetal_count)
        )
        # get new patient ID
        patient_id = cursor.lastrowid

        db1.commit()

        # return info and ID
        return jsonify({"message": "Patient added successfully.", "patient_id": patient_id}), 200

    except Exception as e:
        db1.rollback()
        return jsonify({"error": str(e)}), 400

# ------------------------
# GET /patients
# ------------------------
"Input example: GET /patients/5"
@api_routes.route('/patients', methods=['GET'])
def get_patients():
    cursor = db1.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM PatientInformation")
        patients = cursor.fetchall()
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------
# GET /patients/<patient_id>
# ------------------------
@api_routes.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient_by_id(patient_id):
    cursor = db1.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM PatientInformation WHERE id = %s", (patient_id,))
        patient = cursor.fetchone()

        if patient:
            return jsonify(patient), 200
        else:
            return jsonify({"error": "Patient not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ------------------------
# POST /list_values
# ------------------------
@api_routes.route('/list_values', methods=['POST'])
def add_list_values():
    data = request.json
    cursor = db1.cursor()
    try:
        datapoint_id = data['datapoint_id']
        values = data['values']
        
        for value in values:
            cursor.execute(
                "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                (datapoint_id, value)
            )
        db1.commit()
        return jsonify({"message": "List values added successfully."}), 200
    except Exception as e:
        db1.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400

# ------------------------
# GET /annotations
# ------------------------
    
"""
    Retrieves user-specific annotations.

    Query Parameters:
    - user_id: The ID of the user

    Returns JSON Output:
    {
        "annotations": [
            {"anno_id": <annotation_id>, "category_id": <category_id>, "subcategory_id": <subcategory_id>}
        ]
    }
"""
@api_routes.route('/annotations', methods=['GET'])
def get_annotations():
    user_id = request.args.get('user_id')
    cursor = db1.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM Annotation WHERE user_id = %s", (user_id,))
        annotations = cursor.fetchall()
        return jsonify(annotations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# -------------------------
# GET /user_annotations/<user_id>
# ------------------------
# use user_id to get all attributes that match this user_id

@api_routes.route('/user_annotations/<int:user_id>', methods=['GET'])
def get_annotation_by_id(user_id):
    cursor = db1.cursor(dictionary=True)
    try: 
        cursor.execute("SELECT * FROM UserAnnotations WHERE user_id = %s", (user_id,))
        user = cursor.fetchall()
        
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e: 
        return jsonify({"error": str(e)}), 400

# ---------------------------
# POST /user_annotations
# ---------------------------
# Adds a new user_id and annotation_id pairing. 
# input format: { user_id : <user_id>, annotation_id : <annotation_id> }

@api_routes.route('/user_annotations', methods=['POST'])
def add_user_annotation():
    data = request.json
    cursor = db1.cursor()

    try: 
        user_id = data['user_id']
        category_id = data['category_id']
        cursor.execute("INSERT INTO UserAnnotations (user_id, category_id) VALUES (%s, %s)", (user_id, category_id))
        db1.commit()
        return jsonify({"message": "Added successfully to UserAnnotations"}), 200

    except Exception as e:
        db1.rollback()
        return jsonify({"error": str(e)}), 400

