import os
from flask import Flask, flash, request, send_file, jsonify
from werkzeug.utils import secure_filename
import sys
import subprocess
from subprocess import PIPE
import re

UPLOAD_FOLDER = './uploadFiles/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

result = None


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def detect(imagePath):
    print("Start detecting...")
    # info = subprocess.run([darknet, "detector", "test", dataFile, configFile, weightFile, imagePath],
    #                       stdout=PIPE, stderr=PIPE)
    # print(str(info)
    result = "Message here..."
    print("Finish detection")
    return result


@app.route('/image', methods=['GET', 'POST'])
def image_detection():
    global result
    image_path = None
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return "No image"
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return "No image"
        result = "Can not detect"
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(image_path)
            result = detect(image_path)

    image_result = "predictions.jpg"
    return send_file(image_result, mimetype='image/*')


@app.route('/result', methods=['GET'])
def image_result():
    global result
    print("Get Result: " + str(result))
    return jsonify(result)


@app.route('/')
def hello_world():
    return 'Hello, Find fake team =)))))'


if __name__ == '__main__':
    app.run()