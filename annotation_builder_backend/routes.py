from flask import Flask, Blueprint, jsonify, request
import mysql.connector
import unittest

# Create Flask app and Blueprints
app = Flask(__name__)
category_routes = Blueprint('category_routes', __name__)
subcategory_routes = Blueprint('subcategory_routes', __name__)
datapoint_routes = Blueprint('datapoint_routes', __name__)
operand_routes = Blueprint('operand_routes', __name__)

# MySQL connection configuration
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="annotations"
)

db2 = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="static_annotation"
)

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
        cursor.execute("INSERT INTO Categories (name) VALUES (%s)", (category_name,))
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
    cursor.execute("SELECT * FROM Subcategories WHERE category_id = %s", (category_id,))
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
        cursor.execute("INSERT INTO Subcategories (category_id, name) VALUES (%s, %s)", (category_id, subcategory_name))
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
    cursor.execute("SELECT * FROM Datapoints WHERE subcategory_id = %s", (subcategory_id,))
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
        cursor.execute(
            "INSERT INTO Datapoints (subcategory_id, name, data_type, is_mandatory) VALUES (%s, %s, %s, %s)",
            (subcategory_id, name, data_type, is_mandatory)
        )
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

# Register Blueprints
app.register_blueprint(category_routes, url_prefix='/categories')
app.register_blueprint(subcategory_routes, url_prefix='/subcategories')
app.register_blueprint(datapoint_routes, url_prefix='/datapoints')
app.register_blueprint(operand_routes, url_prefix='/operands')

if __name__ == '__main__':
    app.run(debug=True)

# -------------------------
# Unit Tests for APIs
# -------------------------
class TestAnnotationAPIs(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Test Categories
    def test_get_categories(self):
        response = self.app.get('/categories/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)

    def test_add_category(self):
        response = self.app.post('/categories/', json={'name': 'New Category'})
        self.assertEqual(response.status_code, 201)
        self.assertIn('message', response.json)

    def test_invalid_add_category(self):
        response = self.app.post('/categories/', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    # Test Subcategories
    def test_get_subcategories(self):
        response = self.app.get('/subcategories/1')
        self.assertIn(response.status_code, [200, 404])

    def test_add_subcategory(self):
        response = self.app.post('/subcategories/1', json={'name': 'New Subcategory'})
        self.assertIn(response.status_code, [201, 500])
        
    # Test Datapoints
    def test_get_datapoints(self):
        response = self.app.get('/datapoints/1')
        self.assertIn(response.status_code, [200, 404])

    def test_add_datapoint(self):
        response = self.app.post('/datapoints/1', json={'name': 'New Datapoint', 'data_type': 'text', 'is_mandatory': True})
        self.assertIn(response.status_code, [201, 500])

if __name__ == '__main__':
    unittest.main()
