from flask import Blueprint, jsonify, request
import mysql.connector

# Connect to the database
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="annotations"
)

# Create Blueprint for routes
category_routes = Blueprint('category_routes', __name__)
subcategory_routes = Blueprint('subcategory_routes', __name__)
datapoint_routes = Blueprint('datapoint_routes', __name__)

# -------------------------
# Category Routes
# -------------------------
@category_routes.route('/', methods=['GET'])
def get_categories():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Categories")
    categories = cursor.fetchall()
    return jsonify(categories)

@category_routes.route('/', methods=['POST'])
def add_category():
    data = request.json
    category_name = data['name']
    cursor = db.cursor()
    cursor.execute("INSERT INTO Categories (name) VALUES (%s)", (category_name,))
    db.commit()
    return jsonify({"message": "Category added successfully!"}), 201

# -------------------------
# Subcategory Routes
# -------------------------
@subcategory_routes.route('/<int:category_id>', methods=['GET'])
def get_subcategories(category_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
    subcategories = cursor.fetchall()
    return jsonify(subcategories)

@subcategory_routes.route('/<int:category_id>', methods=['POST'])
def add_subcategory(category_id):
    data = request.json
    subcategory_name = data['name']
    cursor = db.cursor()
    cursor.execute("INSERT INTO Subcategories (category_id, name) VALUES (%s, %s)", (category_id, subcategory_name))
    db.commit()
    return jsonify({"message": "Subcategory added successfully!"}), 201

# -------------------------
# Datapoint Routes
# -------------------------
@datapoint_routes.route('/<int:subcategory_id>', methods=['GET'])
def get_datapoints(subcategory_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
    datapoints = cursor.fetchall()
    return jsonify(datapoints)

@datapoint_routes.route('/<int:subcategory_id>', methods=['POST'])
def add_datapoint(subcategory_id):
    data = request.json
    name = data['name']
    data_type = data['data_type']
    is_mandatory = data['is_mandatory']
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
        (subcategory_id, name, data_type, is_mandatory)
    )
    db.commit()
    return jsonify({"message": "Datapoint added successfully!"}), 201

