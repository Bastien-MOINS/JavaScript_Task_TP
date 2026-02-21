import os
from flask import Flask, send_from_directory

app = Flask(__name__)

# Serve assets requested relatively from /todo/api/v1.0/tasks
@app.route('/todo/api/v1.0/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.root_path, 'css'), filename)


@app.route('/todo/api/v1.0/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(app.root_path, 'js'), filename)


@app.route('/todo/api/v1.0/img/<path:filename>')
def serve_img(filename):
    return send_from_directory(os.path.join(app.root_path, 'img'), filename)