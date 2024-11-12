from flask import Flask
from api_routes import api_routes
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# 注册蓝图
app.register_blueprint(api_routes, url_prefix='/api')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
