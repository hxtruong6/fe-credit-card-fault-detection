from database import read_card
from flask_graphql import GraphQLView
from schema import schema
import os
from flask import Flask, flash, request, send_file, jsonify
from werkzeug.utils import secure_filename
import sys

# Import custom module
from card import *

UPLOAD_FOLDER = "./uploadFiles/"
ALLOWED_EXTENSIONS = set(["png", "jpg", "jpeg"])

app = Flask(__name__)
app.debug = True
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

result = None
info = None
image_path = None


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/verify", methods=["GET"])
def image_verify():
    print("Start detecting...")

    cardInfo = read_card()
    # card_font = cardInfo.name + "_font.jpg"
    card_font = "2" + "_font.jpg"

    image_path = os.path.join(app.config["UPLOAD_FOLDER"], card_font)

    print("Image path: ", image_path)
    cardImage = cv2.imread(image_path)
    c = Card(cardImage)
    # Pipe for verify certified card
    if not c.isExsitBorder():
        result = {"certified": False, "message": "Can not detect card"}
        print("Message: ", result["message"])
        return result

    if not c.isStandardSizeRatio():
        print("Width height ratio:", c.width_height_ratio)
        print("Detal vs standard", abs(c.width_height_ratio - STANDARD_W_H_SIZE_RATIO))
        result = {"certified": False, "message": "Card size seem wrong"}
        print("Message: ", result["message"])
        return result

    if not c.isExsitQhContour():
        print("Can not check Quoc Huy")
        result = {"certified": False, "message": "Can not check Quoc Huy"}
        print("Message: ", result["message"])
        return result
        
    if not c.isMatchQhTemplate():
        result = {
            "certified": False,
            "message": "Quoc Huy seem not like standard Quoc Huy",
        }
        print("Message: ", result["message"])
        return result

    # Check profile picture (selfie image)
    c.cropProfileImage()

    if not c.check_human_face():
        result = {"certified": False, "message": "No have any face on card"}
        print("Message: ", result["message"])
        return result

    if not c.check_face_direction():
        result = {"certified": False, "message": "Face must straight direction"}
        print("Message: ", result["message"])
        return result

    if c.check_lip_opened():
        result = {"certified": False, "message": "Face has no opend lip"}
        print("Message: ", result["message"])
        return result

    if c.check_eye_closed():
        result = {"certified": False, "message": "Face has no closed eye"}
        print("Message: ", result["message"])
        return result

    if c.check_eyeglasses():
        result = {"certified": False, "message": "Face has no glasses"}
        print("Message: ", result["message"])
        return result

    result = {"certified": True, "message": "Verified card successed"}
    print("Finished detection.")
    return result


@app.route("/upload", methods=["GET", "POST"])
def uploadImage():
    result = None
    image_path = None

    if request.method == "POST":
        # check if the post request has the file part
        if "file" not in request.files:
            flash("No file part")
            return "No image"
        file = request.files["file"]
        print("File: ", file)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(image_path)
            result = "Upload successed"
    print("Upload result: ", result)
    return result


@app.route("/info", methods=["GET", "POST"])
def recieve_info():
    global info
    info = request.data
    print("Info data: ", info)
    return True


@app.route("/verify", methods=["GET"])
def image_result():
    global result
    print("Get Result: " + str(result))
    return jsonify(result)


@app.route("/")
def hello_world():
    return "Hello, Find fake team =)))))"


default_query = """
{
  all_cards {
    edges {
      node {
        id
        idNumber
        name
        cardName
        dob
        hometown
        address
        image
      }
    }
  }
}""".strip()

app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)

if __name__ == "__main__":
    # init_db()
    app.run()
