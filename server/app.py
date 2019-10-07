from database import read_card
from flask_graphql import GraphQLView
from schema import schema
import os
from flask import Flask, flash, request, send_file, jsonify
from werkzeug.utils import secure_filename
import sys
import warnings
warnings.filterwarnings("ignore")
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
image_result = None
image_fake_bounding = None


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# TODO: send a request with ID number to get specific card
@app.route("/verify", methods=["GET", "POST"])
def image_verify(forceId=1):
    global image_result, image_path
    print("Start detecting...")

    cardInfo = read_card()
    if forceId:
        cardInfo["idNumber"] = str(forceId)
    card_font = os.path.join(
        app.config["UPLOAD_FOLDER"], cardInfo.idNumber + "_font.jpg"
    )
    card_selfie = os.path.join(
        app.config["UPLOAD_FOLDER"], cardInfo.idNumber + "_self.jpg"
    )
    # card_selfie = None

    print("Image path: ", card_font)
    cardImage = cv2.imread(card_font)
    c = Card(cardImage, cardInfo.idNumber)

    # Pipe for verify certified card
    global result
    if not c.isExsitBorder():
        result = {"certified": False, "message": "Can not detect card"}
        print("Message: ", result["message"])
        return result

    image_result = c.getCard(cardInfo.idNumber)
    print("Image result: ", image_result)

    print("Checking stanard size ratio...")
    if not c.isStandardSizeRatio():
        print("Width height ratio:", c.width_height_ratio)
        print("Detal vs standard", abs(c.width_height_ratio - STANDARD_W_H_SIZE_RATIO))
        result = {"certified": False, "message": "Card size seem wrong"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking Quoc Huy on card...")
    if not c.isExsitQhContour():
        print("Can not check Quoc Huy")
        result = {"certified": False, "message": "Can not check Quoc Huy"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking match Quoc Huy template...")
    if not c.isMatchQhTemplate():
        result = {
            "certified": False,
            "message": "Quoc Huy seem not like standard Quoc Huy",
        }
        print("Message: ", result["message"])
        return result

    # Check profile picture (selfie image)
    c.cropProfileImage()

    print("PASS\nChecking human face on card...")
    if not c.check_human_face():
        result = {"certified": False, "message": "No have any face on card"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking face must be has straight direction...")
    if not c.check_face_direction():
        result = {"certified": False, "message": "Face has not straight direction"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking lip is opening...")
    if c.check_lip_opened():
        result = {"certified": False, "message": "Face has opend lip"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking eye close...")
    if c.check_eye_closed():
        result = {"certified": False, "message": "Face has closed eye"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking eye glasses...")
    if c.check_eyeglasses():
        result = {"certified": False, "message": "Face has glasses"}
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking match with selfie image...")
    if card_selfie and not c.check_matched_faces(card_selfie):
        result = {
            "certified": False,
            "message": "Face in card is different with face in selfie image",
        }
        print("Message: ", result["message"])
        return result

    print("PASS\nChecking no any emnotion on face card...")
    if not c.check_emotion():
        result = {"certified": False, "message": "Face has emotion when take picture"}
        print("Message: ", result["message"])
        return result

    # OCR
    print('PASS\nChecking information of card...')
    if not c.check_information(cardInfo):
        result = {"certified": False, "message": "Not match the filled information with information on card."}
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


@app.route("/get_card", methods=["GET", "POST"])
def image_result(forceId=1):
    global image_result
    print("Get_card: ", image_result)
    if forceId:
        image_result = "./verifyResults/" + forceId + ".jpg"
    if image_result:
        return send_file(image_result, mimetype="image/*")
    return None


@app.route("/")
def hello_world():
    return "Hello, Find fake team =)))))\nWe are coders. Nice to meet you!"


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
