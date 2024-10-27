from flask import Flask, jsonify, request
import mysql.connector
from routes import category_routes, subcategory_routes, datapoint_routes, operand_routes 

app = Flask(__name__)

# MySQL connection configuration
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",  # no password
    database="annotations"
)

# MySQL connection static configuration
db2 = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",  # no password
    database="static_annotation"
)

# Register blueprint for our routes
app.register_blueprint(category_routes)
app.register_blueprint(subcategory_routes)
app.register_blueprint(datapoint_routes)
app.register_blueprint(operand_routes)

@app.route('/')
def home():
    return "Backend is connected to MySQL!"

if __name__ == '__main__':
    app.run(debug=True)

