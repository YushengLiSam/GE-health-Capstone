from flask import Flask
from api_routes import category_routes, subcategory_routes, datapoint_routes, operand_routes

app = Flask(__name__)

# 注册蓝图
app.register_blueprint(category_routes, url_prefix='/categories')
app.register_blueprint(subcategory_routes, url_prefix='/subcategories')
app.register_blueprint(datapoint_routes, url_prefix='/datapoints')
app.register_blueprint(operand_routes, url_prefix='/operands')


@app.route('/')
def home():
    return "Backend is connected to MySQL!"


if __name__ == '__main__':
    app.run(debug=True)
