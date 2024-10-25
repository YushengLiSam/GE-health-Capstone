from flask import Flask, jsonify, request
import mysql.connector

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

@app.route('/')
def home():
    return "Backend is connected to MySQL!"

if __name__ == '__main__':
    app.run(debug=True)

