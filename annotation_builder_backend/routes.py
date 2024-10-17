from flask import request, jsonify
from app import app, mysql
from models import Category, Subcategory, Datapoint

# API to get all categories
@app.route('/get_categories', methods=['GET'])
def get_categories():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Categories")
    categories = cur.fetchall()
    cur.close()

    categories_list = [{"id": row[0], "name": row[1]} for row in categories]
    return jsonify(categories_list)

# API to add a new category
@app.route('/add_category', methods=['POST'])
def add_category():
    data = request.get_json()
    name = data['name']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Categories (name) VALUES (%s)", [name])
    mysql.connection.commit()
    cur.close()
    
    return jsonify({'message': 'Category added successfully'})

# API to get subcategories for a category
@app.route('/get_subcategories/<int:category_id>', methods=['GET'])
def get_subcategories(category_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Subcategories WHERE category_id = %s", [category_id])
    subcategories = cur.fetchall()
    cur.close()

    subcategories_list = [{"id": row[0], "category_id": row[1], "name": row[2]} for row in subcategories]
    return jsonify(subcategories_list)

# API to add a subcategory to a category
@app.route('/add_subcategory', methods=['POST'])
def add_subcategory():
    data = request.get_json()
    category_id = data['category_id']
    name = data['name']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Subcategories (category_id, name) VALUES (%s, %s)", (category_id, name))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Subcategory added successfully'})

# API to get datapoints for a subcategory
@app.route('/get_datapoints/<int:subcategory_id>', methods=['GET'])
def get_datapoints(subcategory_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Datapoints WHERE subcategory_id = %s", [subcategory_id])
    datapoints = cur.fetchall()
    cur.close()

    datapoints_list = [
        {
            "id": row[0],
            "subcategory_id": row[1],
            "name": row[2],
            "datatype": row[3],
            "is_mandatory": row[4]
        } for row in datapoints
    ]
    return jsonify(datapoints_list)

# API to add a datapoint to a subcategory
@app.route('/add_datapoint', methods=['POST'])
def add_datapoint():
    data = request.get_json()
    subcategory_id = data['subcategory_id']
    name = data['name']
    datatype = data['datatype']
    is_mandatory = data['is_mandatory']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Datapoints (subcategory_id, name, datatype, is_mandatory) VALUES (%s, %s, %s, %s)",
                (subcategory_id, name, datatype, is_mandatory))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Datapoint added successfully'})

# API to add list values to a datapoint (for dropdown)
@app.route('/add_listvalue', methods=['POST'])
def add_listvalue():
    data = request.get_json()
    datapoint_id = data['datapoint_id']
    value = data['value']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO ListValues (datapoint_id, value) VALUES (%s, %s)", (datapoint_id, value))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'List value added successfully'})

