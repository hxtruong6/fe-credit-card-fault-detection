import os
from flask import Flask, flash, request, send_file, jsonify
from werkzeug.utils import secure_filename
import sys
import subprocess
from subprocess import PIPE
import re

from card import *

UPLOAD_FOLDER = './uploadFiles/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

result = None
info = None
image_path = None


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def image_verify(image_path):
    print("Start detecting...")

    cardImage = cv2.imread(image_path)
    c = Card(cardImage)
    # Pipe for verify certified card
    if not c.isExsitBorder():
        result = {'certified': False, 'message': "Can not detect card"}
        return result

    if not c.isStandardSizeRatio():
        print("Width height ratio:", c.width_height_ratio)
        print("Detal vs standard",
              abs(c.width_height_ratio - STANDARD_W_H_SIZE_RATIO))
        result = {'certified': False, 'message': "Card size seem wrong"}
        return result

    if not c.isExsitQhContour():
        print("Can not check Quoc Huy")
        result = {'certified': False, 'message': "Can not check Quoc Huy"}
        return result

    if not c.isMatchQhTemplate():
        print("Quoc Huy seem not like standard Quoc Huy")
        result = {'certified': False, 'message': "Quoc Huy seem not like standard Quoc Huy"}
        return result

    # Check profile picture (selfie image)
    c.cropProfileImage()
    if not c.check_human_face():
        print("No have any face on card")
        result = {'certified': False, 'message': "No have any face on card"}
        return result

    if not c.check_face_direction():
        print("Face must straight direction")
        result = {'certified': False, 'message': "Face must straight direction"}
        return result

    # if  c.check_lip_opened():
    #     print("No have any face on card")
    #     result = {'certified': False, 'message': "No have any face on card"}
    #     return result

    # if not c.check_eye_closed():
    #     print("No have any face on card")
    #     result = {'certified': False, 'message': "No have any face on card"}
    #     return result

    # if not c.check_eyeglasses():
    #     print("No have any face on card")
    #     result = {'certified': False, 'message': "No have any face on card"}
    #     return result

    

    result = {'certified': True, 'message': "Verified card success"}

    print("Finished detection")
    return result


@app.route('/image', methods=['GET', 'POST'])
def card_detection():
    global result
    global image_path

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

            result = image_verify(image_path)

    # image_result = "result.jpg"
    # return send_file(image_result, mimetype='image/*')
    return jsonify(result)


@app.route('/info', methods=['GET', 'POST'])
def recieve_info():
    global info
    info = request.data
    print("Info data: ", info)
    return True


@app.route('/verify', methods=['GET'])
def image_result():
    global result
    print("Get Result: " + str(result))
    return jsonify(result)


@app.route('/')
def hello_world():
    return 'Hello, Find fake team =)))))'


if __name__ == '__main__':
    app.run()