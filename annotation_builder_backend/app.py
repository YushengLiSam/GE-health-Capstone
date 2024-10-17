from flask import Flask
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mysql = MySQL(app)

# A test route to ensure everything is working
@app.route('/')
def index():
    return "Hello, Annotation Builder!"

if __name__ == '__main__':
    app.run(debug=True)

