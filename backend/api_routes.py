from flask import Blueprint, jsonify, request
import mysql.connector

# Connect to the database
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="annotations"
)

# Connect to static database
db2 = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="static_annotation"
)

# Create Blueprints for routes
category_routes = Blueprint('category_routes', __name__)
subcategory_routes = Blueprint('subcategory_routes', __name__)
datapoint_routes = Blueprint('datapoint_routes', __name__)
operand_routes = Blueprint('operand_routes', __name__)

# -------------------------
# Category Routes
# -------------------------


@category_routes.route('/', methods=['GET'])
def get_categories():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Categories")
    categories = cursor.fetchall()
    return jsonify(categories), 200


@category_routes.route('/', methods=['POST'])
def add_category():
    data = request.json
    if 'name' not in data or not data['name'].strip():
        return jsonify({"error": "Category name is required"}), 400

    category_name = data['name']
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO Categories (name) VALUES (%s)", (category_name,))
        db.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500

    return jsonify({"message": "Category added successfully!"}), 201

# -------------------------
# Subcategory Routes
# -------------------------


@subcategory_routes.route('/<int:category_id>', methods=['GET'])
def get_subcategories(category_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
    subcategories = cursor.fetchall()
    if not subcategories:
        return jsonify({"message": "No subcategories found for this category"}), 404
    return jsonify(subcategories), 200


@subcategory_routes.route('/<int:category_id>', methods=['POST'])
def add_subcategory(category_id):
    data = request.json
    if 'name' not in data or not data['name'].strip():
        return jsonify({"error": "Subcategory name is required"}), 400

    subcategory_name = data['name']
    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO Subcategories (category_id, name) VALUES (%s, %s)",
                       (category_id, subcategory_name))
        db.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500

    return jsonify({"message": "Subcategory added successfully!"}), 201

# -------------------------
# Datapoint Routes
# -------------------------


@datapoint_routes.route('/<int:subcategory_id>', methods=['GET'])
def get_datapoints(subcategory_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
    datapoints = cursor.fetchall()
    if not datapoints:
        return jsonify({"message": "No datapoints found for this subcategory"}), 404
    return jsonify(datapoints), 200


@datapoint_routes.route('/<int:subcategory_id>', methods=['POST'])
def add_datapoint(subcategory_id):
    data = request.json
    if 'name' not in data or not data['name'].strip():
        return jsonify({"error": "Datapoint name is required"}), 400
    if 'data_type' not in data or data['data_type'] not in ['numeric', 'text', 'list', 'boolean', 'number_spinner']:
        return jsonify({"error": "Valid data_type is required"}), 400

    name = data['name']
    data_type = data['data_type']
    is_mandatory = data.get('is_mandatory', False)

    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
                       (subcategory_id, name, data_type, is_mandatory))
        db.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500

    return jsonify({"message": "Datapoint added successfully!"}), 201

# -------------------------
# Operand Routes
# -------------------------


@operand_routes.route('/', methods=['GET'])
def get_operands():
    cursor = db2.cursor(dictionary=True)
    cursor.execute("SELECT symbol FROM Symbols")
    operands = cursor.fetchall()
    operand_list = [operand['symbol'] for operand in operands]
    return jsonify(operand_list), 200
