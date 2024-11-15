from flask import Flask
from api_routes import api_routes

app = Flask(__name__)

# 注册蓝图
app.register_blueprint(api_routes, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
