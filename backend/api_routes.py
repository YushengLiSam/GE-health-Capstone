from flask import Blueprint, jsonify, request
import mysql.connector
import json
import os
from flask_cors import CORS


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




# Create Blueprint for routes
api_routes = Blueprint('api_routes', __name__)
CORS(api_routes)

# Define routes in the blueprint

@api_routes.route('/')
def index():
   return jsonify({"message": "API is working!"})


HARDCODED_CATEGORIES = {
   "Active Labor (5cm-8cm)": {
       "subcategories": [
           {
               "name": "Vitals",
               "datapoints": [
                   {"name": "HR", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True},
                   {"name": "Respirations", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True},
                   {"name": "Blood Pressure", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True},
                   {"name": "Pulse Ox", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True},
                   {"name": "Temperature", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True}
               ]
           },
           {
               "name": "Pain Management",
               "datapoints": [
                   {"name": "Pain Level", "datatype": "List", "inputType": "Dropdown",
                       "isMandatory": False, "listItems": ["Mild", "Moderate", "Severe"]}
               ]
           }
       ]
   },
   "Pushing/Delivery": {
       "subcategories": [
           {
               "name": "FHR",
               "datapoints": [
                   {"name": "FHR Reading", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True}
               ]
           },
           {
               "name": "Contractions",
               "datapoints": [
                   {"name": "Contraction Frequency", "datatype": "Numeric",
                       "inputType": "Textbox", "isMandatory": True}
               ]
           }
       ]
   }
}




# -------------------------
# POST /categories
# -------------------------


@api_routes.route('/categories', methods=['POST'])
def add_categories():
   data = request.json
   cursor = db1.cursor()
   try:
       for category in data['categories']:
           # Insert category
           category_name = category['name'].strip()  # Remove any extra spaces
           cursor.execute(
               "SELECT id FROM Categories WHERE name = %s", (category_name,))
           result = cursor.fetchone()


           if result is not None:
               category_id = result[0]
           else:
               cursor.execute(
                   "INSERT INTO Categories (name) VALUES (%s)", (category_name,))
               category_id = cursor.lastrowid  # Get the last inserted ID


               # Check if the category is in HARDCODED_CATEGORIES
               if category_name in HARDCODED_CATEGORIES:
                   # Get the hardcoded subcategories for this category
                   hardcoded_subcategories = HARDCODED_CATEGORIES[category_name]['subcategories']


                   # Add each subcategory
                   for subcategory in hardcoded_subcategories:
                       subcategory_name = subcategory['name']
                       cursor.execute(
                           "INSERT INTO Subcategories (name, category_id) VALUES (%s, %s)", (subcategory_name, category_id))
                       subcategory_id = cursor.lastrowid


                       # Add datapoints for each subcategory
                       for datapoint in subcategory['datapoints']:
                           datapoint_name = datapoint['name']
                           data_type = datapoint['datatype'].lower()
                           is_mandatory = datapoint['isMandatory']
                           cursor.execute(
                               "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                               (subcategory_id, datapoint_name,
                                data_type, is_mandatory)
                           )
                           datapoint_id = cursor.lastrowid


                           # If the data type is List, save the list items
                           if data_type == 'list':
                               for item in datapoint.get('listItems', []):
                                   cursor.execute(
                                       "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)",
                                       (datapoint_id, item)
                                   )
       # Commit all changes
       db1.commit()
       return jsonify({"message": "Categories, subcategories, and datapoints added successfully."}), 200


   except Exception as e:
       db1.rollback()  # Rollback in case of error
       return jsonify({"error": str(e)}), 400


# -------------------------
# GET /categories
# -------------------------
# Fetch all category names and ids




@api_routes.route('/categories', methods=['GET'])
def get_categories():
   try:
       cursor = db1.cursor(dictionary=True)


       # Select only the name and id from Categories table
       cursor.execute("SELECT id, name FROM Categories")
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
   category_id = data.get('id')


   if not category_id:
       return jsonify({"error": "Category ID is required"}), 400


   try:
       cursor = db1.cursor(dictionary=True)


       # Delete the specified category using the ID
       cursor.execute("DELETE FROM Categories WHERE id = %s", (category_id,))


       # Check if there are no more categories left
       cursor.execute("SELECT COUNT(*) AS category_count FROM Categories")
       result = cursor.fetchone()
       if result['category_count'] == 0:
           # Reset the AUTO_INCREMENT (id) value to 1
           cursor.execute("ALTER TABLE Categories AUTO_INCREMENT = 1")


       db1.commit()


       # Return the remaining categories by calling the existing get_categories method
       return get_categories()


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


@api_routes.route('/subcategories', methods=['POST'])
def add_subcategories():
   data = request.json
   cursor = db1.cursor()
   # categories = data.get('categories', [])
   try:
       category_name = data['category']
       cursor.execute(
           "SELECT id FROM categories WHERE name = %s", (category_name,))
       result = cursor.fetchone()
       if result is not None:
           category_id = result[0]


       else:
           cursor.execute(
               "INSERT INTO categories (name) VALUES (%s)", (category_name,))
           category_id = cursor.lastrowid  # Get the last inserted ID


       for subcategory in data['subcategory']:
           # Remove any extra spaces
           subcategory_name = subcategory['name'].strip()
           print(subcategory_name)
           print(category_id)  # all good
           cursor.execute(
               "SELECT id FROM subcategories WHERE category_id = %s AND name = %s", (category_id, subcategory_name))
           result = cursor.fetchone()
           if result is not None:
               subcategory_id = result[0]
           else:
               cursor.execute(
                   "INSERT INTO subcategories (name, category_id) VALUES (%s, %s)", (subcategory_name, category_id))
               subcategory_id = cursor.lastrowid


           for datapoint in subcategory['datapoints']:


               datapoint_name = datapoint['name'].lower()
               data_type = datapoint['datatype'].lower()
               is_mandatory = datapoint['isMandatory']


               cursor.execute("INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)", (subcategory_id, datapoint_name, data_type, is_mandatory)
                              )
               datapoint_id = cursor.lastrowid


               # If the data type is List, save the list items
               if data_type == 'list':
                   for item in datapoint['listItems']:
                       cursor.execute(
                           "INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)", (datapoint_id, item))
       # Commit all changes
       db1.commit()
       return jsonify({"message": "Subcategories, and datapoints added successfully."}), 200


   except Exception as e:
       db1.rollback()  # Rollback in case of error
       return jsonify({"error": str(e)}), 602


# ------------------------
# POST /get_subcategories
# ------------------------
# Return the subcategory with the subcategory_name, provided through a JSON File with the contents:"category_name":"<category_name>" "subcategory_name": "<subcategory_name>"


@api_routes.route('/subcategories', methods=['GET'])
def get_subcategories():
   category_id = request.args.get('category_id')
   category_name = request.args.get('category_name')


   try:
       cursor = db1.cursor(dictionary=True)


       if category_id:
           # Find the category by ID
           cursor.execute("SELECT id FROM Categories WHERE id= %s", (category_id,))
       elif category_name:
           # Find the category by name if ID is not provided
           cursor.execute("SELECT id FROM Categories WHERE name= %s", (category_name,))
       else:
           return jsonify({"error": "Either category ID or category name is required"}), 400


       category = cursor.fetchone()


       if not category:
           return jsonify({"error": "Category not found"}), 404


       category_id = category['id']


       # Find subcategories for the given category
       cursor.execute("SELECT id, name FROM Subcategories WHERE category_id = %s", (category_id,))
       subcategories = cursor.fetchall()


       return jsonify({"subcategories": subcategories}), 200


   except Exception as e:
       return jsonify({"error": str(e)}), 500




# -------------------------
# DELETE /subcategories
# -------------------------
# Deletes subcategory with JSON data in same format as get_subcategory


@api_routes.route('/subcategories', methods=['DELETE'])
def delete_subcategories():
   data = request.json
   try:
       category_name = data.get('category_name')
       cursor = db1.cursor(dictionary=True)
       cursor.execute(
           "SELECT * FROM Categories WHERE name = %s", (category_name,))
       category = cursor.fetchone()
       if category is None:
           return jsonify({"error": "Category not found"}), 404


       cursor.execute(
           "SELECT id FROM categories WHERE name = %s", (category_name,))
       category_id = cursor.fetchone()
       if category_id:
           print(category_id)
           category_id = category_id['id']
           print(category_id)
       else:
           return jsonify({"error": "Category not found"}), 404
       print(category_name)
       subcategory_name = data.get('subcategory_name')
       cursor.execute("SELECT * FROM subcategories WHERE category_id = %s AND name = %s",
                      (category_id, subcategory_name))
       subcategories = cursor.fetchall()
       # Fetch datapoints for each subcategory
       for subcategory in subcategories:
           subcategory_id = subcategory['id']
           cursor.execute(
               "DELETE FROM subcategories WHERE id = %s AND category_id = %s", (subcategory_id, category_id))
       db1.commit()


       return jsonify({"message": "Category and its related data deleted successfully!"}), 200


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



