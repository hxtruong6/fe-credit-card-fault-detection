# from matplotlib import pyplot as plt

# Linux commands:
# sudo apt update
# sudo apt install tesseract-ocr
# sudo apt install libtesseract-dev

# !pip install pillow
# !pip install pytesseract
# !pip install opencv-python


debug = True

import cv2
import numpy as np
import random
import sys
import re
import json

try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract
import argparse
import utilsImage

# import cv2
import os

kernel = np.ones((2, 2), np.uint8)
# res2 = cv2.morphologyEx(res, cv2.MORPH_CLOSE, kernel)


def resizeImageByWidth(img, width=856, height=548):
    currRatio = img.shape[0] / img.shape[1]
    #     print('Shape: ', img.shape
    #     height = int(width * currRatio)
    dim = (width, height)
    #     print('Resized shape: ', dim)
    # resize image
    resized = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
    # showImg(resized, "Resized")
    return resized


def showImg(img, title=str(round(random.random() * 1000, 0))):
    if debug:
        cv2.imshow(title, img)
        cv2.waitKey(0)
        cv2.destroyWindow(title)


def cropImage(image, offsetX, offsetY, width, height):
    cardNu_threshold = 10
    minX = offsetX
    minY = offsetY
    cardNuWidth = width
    cardNuHeight = height

    cropped = image[
        minY - cardNu_threshold : minY + cardNuHeight + cardNu_threshold,
        minX - cardNu_threshold : minX + cardNuWidth + cardNu_threshold,
    ]

    # showImg(cropped, "Cropped")

    return cropped


def histogramEqualize(img):
    # -----Converting image to LAB Color model-----------------------------------
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    # cv2.imshow("lab",lab)

    # -----Splitting the LAB image to different channels-------------------------
    l, a, b = cv2.split(lab)
    # cv2.imshow('l_channel', l)
    # cv2.imshow('a_channel', a)
    # cv2.imshow('b_channel', b)

    # -----Applying CLAHE to L-channel-------------------------------------------
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    #     cv2.imshow('CLAHE output', cl)

    # -----Merge the CLAHE enhanced L-channel with the a and b channel-----------
    limg = cv2.merge((cl, a, b))
    #     cv2.imshow('limg', limg)

    # -----Converting image from LAB Color model to RGB model--------------------
    final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    #     cv2.imshow('final', final)

    #     cv2.waitKey(0)
    #     cv2.destroyAllWindows()
    return final


# ## String preprocessing


def remove_accent(s):
    s = re.sub("[àáạảãâầấậẩẫăằắặẳẵ]", "a", s)
    s = re.sub("[ÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪ]", "A", s)
    s = re.sub("[èéẹẻẽêềếệểễ]", "e", s)
    s = re.sub("[ÈÉẸẺẼÊỀẾỆỂỄ]", "E", s)
    s = re.sub("[òóọỏõôồốộổỗơờớợởỡ]", "o", s)
    s = re.sub("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]", "O", s)
    s = re.sub("[ìíịỉĩ]", "i", s)
    s = re.sub("[ÌÍỊỈĨ]", "I", s)
    s = re.sub("[ùúụủũưừứựửữ]", "u", s)
    s = re.sub("[ƯỪỨỰỬỮÙÚỤỦŨ]", "U", s)
    s = re.sub("[ỳýỷỹỵ]", "y", s)
    s = re.sub("[ỲÝỴỶỸ]", "Y", s)
    s = re.sub("Đ", "D", s)
    s = re.sub("đ", "d", s)
    return s


def normalize_string(name):
    name = remove_accent(name)
    name = re.sub(
        "[^a-zA-Z0-9 -,ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u",
        "",
        name,
    )
    if len(name) == 0:
        return ""

    while len(name) > 0 and not str.isalnum(name[0]):  # or not str.isalnum(name[-1]):
        name = name[1:]

    while len(name) > 0 and not str.isalnum(name[-1]):
        name = name[:-1]

    #     name = name.strip('.')#'[.,\\W\\D]')

    name = " ".join(name.split())
    if debug:
        print(name)
    return name


def count_different_characters(str1, str2):
    count = abs(len(str1) - len(str2))
    for i in range(0, min(len(str1), len(str2))):
        if str1[i] != str2[i]:
            count = count + 1
    return count


def get_most_frequent(List):
    dict = {}
    count, itm = 0, ""
    for item in reversed(List):
        dict[item] = dict.get(item, 0) + 1
        if dict[item] >= count:
            count, itm = dict[item], item
    return itm


import re

# Kiểm tra xem ngày sinh có hợp lệ
# True: hợp lệ
# False: không hợp lệ
def check_valid_birthday(string):
    if re.fullmatch("([0-9]{2}-){2}[0-9]{4}", string):
        token = string.split("-")
        day = int(token[0])
        month = int(token[1])
        year = int(token[2])

        if month in (1, 3, 5, 7, 8, 10, 12) and day in range(1, 32):
            return True
        elif month in (4, 6, 9, 11) and day in range(1, 31):
            return True
        elif (
            month == 2
            and ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0)
            and day in range(1, 30)
        ):
            return True
        elif (
            month == 2
            and not ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0)
            and day in range(1, 29)
        ):
            return True
        else:
            return False
    else:
        return False


# ## Util functions for extract text


# remove background, just keep text color from image
# imput image instance
def keepColor(image, lower, upper):
    frame = image.copy()
    # Convert BGR to HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    # cv.imshow("hsv", hsv)
    # define range of blue color in HSV

    # Threshold the HSV image to get only blue colors
    res = cv2.inRange(hsv, lower, upper)
    # Bitwise-AND mask and original image
    #     res = cv2.bitwise_and(frame,frame, mask= mask)
    #     cv2.imshow('frame',frame)
    #     cv2.imshow('mask',mask)
    #     cv2.imshow('res',res)
    #     cv2.waitKey(0)
    #     cv2.destroyAllWindows()

    # showImg(res, "filtered")

    #     showImg(res2, 'applied')
    return res


def extractText(image, lang=None):

    # Window: Point tesseract execute file path here
    #     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    # Write down temporary file to extract
    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, image)

    # extract text from image using tesseract ocr
    text = pytesseract.image_to_string(Image.open(filename), lang="vie")

    # Remove temporary image
    os.remove(filename)

    return text


def extractDigits(image):

    # Window: Point tesseract execute file path here
    #     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    # Write down temporary file to extract
    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, image)

    # extract text from image using tesseract ocr
    text = pytesseract.image_to_string(Image.open(filename), config="digits")

    # Remove temporary image
    os.remove(filename)

    return text


# ## 1. Get Id number function


# get Id number function
# key color = in range [50 - 80]
def getIdNumber(image, V_upper_color=70):
    # load image
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_img = cropImage(originImg, 400, 140, 350, 40)
    cv2.imwrite("./cropExtractor/IdName.jpg", cropped_img)
    #     showImg(cropped_img, "Cropped")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filteredImg = keepColor(cropped_img, lower, upper)
    #     showImg(filteredImg)
    cv2.imwrite("./cropExtractor/IdNameFilter.jpg", filteredImg)

    # extract text
    res = extractText(filteredImg)

    # remove non digit characters
    #     res = re.sub("\\D", '', res)

    return res


# ## 2. Get fullnameresizeImageByWidth


# get Id number function
# key color = in range [50 - 80]
def getFullname(image, V_upper_color=70):
    # load image
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_line1 = cropImage(originImg, 360, 195, 500, 40)
    cropped_line2 = cropImage(originImg, 275, 245, 500, 40)

    #     showImg(cropped_line1, "Cropped 1")
    #     showImg(cropped_line2, "Cropped 2")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filtered_1 = keepColor(cropped_line1, lower, upper)
    filtered_2 = keepColor(cropped_line2, lower, upper)

    #     showImg(filtered_1, "filter 1")
    #     showImg(filtered_2, "filter 2")

    # extract text
    line1 = extractText(filtered_1).strip()
    #     line1 = re.sub("!(a-zA-Z)", '', line1)

    line2 = extractText(filtered_2).strip()
    #     line2 = re.sub("!(a-zA-Z)", '', line2)

    res = ""
    if len(line1) > 0:
        res = line1 + " "
    res += line2

    return res.strip()


# ## 2. Get DOB


# get Id number function
# key color = in range [30 - 80]
def getDateOfBirth(image, V_upper_color=50):
    # originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    # cropped_img = cropImage(originImg, 400, 300, 360, 40)
    #     showImg(cropped_img, "Cropped")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filteredImg = keepColor(image, lower, upper)
    #     showImg(filteredImg, 'filtered')

    # extract text
    res = extractDigits(filteredImg)

    # remove non digit characters or '-' character
    #     res = re.sub("!(\\d|-)", '', res)
    return res.strip()


# print(getDateOfBirth(cv2.imread('./data/temp4.jpg'), 70)) #key


# ## 3. Get POB


# get Id number function
# key color = in range [30 - 80]
def getPlaceOfBirth(image, V_upper_color=60):

    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_img_line1 = cropImage(originImg, 450, 340, 400, 40)
    cropped_img_line2 = cropImage(originImg, 280, 390, 600, 40)
    #     showImg(cropped_img_line1, "Cropped line1")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filtered_line1 = keepColor(cropped_img_line1, lower, upper)
    filtered_line2 = keepColor(cropped_img_line2, lower, upper)

    #     showImg(filteredImg, 'filtered')

    # extract text
    line1 = extractText(filtered_line1)
    #     line1 = re.sub("!(a-zA-Z0-9|,)", '', line1)

    line2 = extractText(filtered_line2)
    #     line2 = re.sub("!(a-zA-Z0-9|,)", '', line2)

    res = ""
    if len(line1) > 0:
        res = line1 + " "
    res += line2

    # line 2
    return res.strip()


# ## 4. Get Current address


# get Id number function
# key color = in range [30 - 80]
def getCurrentAddress(image, V_upper_color=50):
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_img_line1 = cropImage(originImg, 540, 435, 300, 40)
    cropped_img_line2 = cropImage(originImg, 240, 480, 600, 40)
    #     showImg(cropped_img_line1, "Cropped line1")
    #     showImg(cropped_img_line2, "Cropped line2")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filtered_line1 = keepColor(cropped_img_line1, lower, upper)
    filtered_line2 = keepColor(cropped_img_line2, lower, upper)

    #     showImg(filtered_line1, "filtered line1")
    #     showImg(filtered_line2, "filtered line2")

    # extract text
    line1 = extractText(filtered_line1)
    #     line1 = re.sub("!(a-zA-Z0-9|,)", '', line1)

    line2 = extractText(filtered_line2)
    #     line2 = re.sub("!(a-zA-Z0-9|,)", '', line2)

    res = ""
    if len(line1) > 0:
        res = line1 + " "
    res += line2

    # line 2
    return res


# print(getCurrentAddress('./data/temp4.jpg', 50))


# ## 5. Get offical country name


# get Id number function
# key color = in range [30 - 80]
def getOfficalCountryName(image, V_upper_color=85):
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_line1 = cropImage(originImg, 275, 20, 560, 32)
    #     showImg(cropped_line1, "Cropped line 1")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filtered_line1 = keepColor(cropped_line1, lower, upper)

    #     showImg(filtered_line1, 'filtered line 1')

    # extract text
    line1 = extractText(filtered_line1)
    #     line1 = re.sub("!(a-zA-Z0-9)", '', line1)
    return line1


# get Offical title function
# key color = in range [30 - 80]
def getOfficalTitle(image, V_upper_color=100):
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_line2 = cropImage(originImg, 385, 65, 420, 12)
    #     showImg(cropped_line2, "Cropped line 2")

    # filter

    lower = np.array([0, 0, 0])
    upper = np.array([180, 255, V_upper_color])  # V in range (50 - 80) is fine

    filtered_line2 = keepColor(cropped_line2, lower, upper)
    #     showImg(filtered_line2, 'filtered line 2')

    # extract text
    line2 = extractText(filtered_line2)
    #     line2 = re.sub("!(a-zA-Z0-9)", '', line2)
    return line2


# print(getOfficalTitle('./data/temp4.jpg'))


# ## 6. Get card name


# get Offical title function
# key color = in range [30 - 80]
def getCardName(image, V_upper_color=100):
    originImg = image.copy()
    #     showImg(originImg, "Origin image")

    # Crop id number area
    cropped_line2 = cropImage(originImg, 300, 99, 500, 38)
    cv2.imwrite("./cropExtractor/CardName.jpg", cropped_line2)
    # showImg(cropped_line2, "Cropped line 2")

    hsv = cv2.cvtColor(cropped_line2, cv2.COLOR_BGR2HSV)

    # get RED range colors
    mask1 = cv2.inRange(hsv, (0, 70, 50), (10, 255, 255))
    mask2 = cv2.inRange(hsv, (170, 70, 50), (180, 255, 255))

    #     showImg(mask1, 'mask1')
    #     showImg(mask2, 'mask2')

    ## Merge the mask and crop the red regionszzzzz
    mask = cv2.bitwise_or(mask1, mask2)
    cv2.imwrite("./cropExtractor/CardNameMask.jpg", mask)

    # showImg(mask, "mask")

    #     res = cv2.bitwise_and(cropped_line2 , cropped_line2, mask= mask)
    #     res = cv2.cvtColor(res, cv2.COLOR_HSV2BGR)
    #     showImg(res, 'filtered line 2')

    # extract text
    line2 = extractText(mask)

    return line2


# print(getCardName('./data/temp4.jpg'))


# # Brute force funcs


def brute_force_official_country_name(image):

    # country name
    sName = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
    name = ""
    min = count_different_characters(name, sName)

    for color in range(60, 120, 5):
        s = getOfficalCountryName(image, color)
        s = normalize_string(s)
        count = count_different_characters(s, sName)
        if count < min:
            min = count
            name = s
        if count == 0:
            break

    return name


def brute_force_official_country_title(image):
    # country name
    sName = "Độc lập - Tự do - Hạnh phúc"
    name = ""
    min = count_different_characters(name, sName)

    for color in range(60, 120, 5):
        s = getOfficalTitle(image, color)
        s = normalize_string(s)
        count = count_different_characters(s, sName)
        if count < min:
            min = count
            name = s
        if count == 0:
            break

    return name


debug = False


def brute_force_card_name(image):
    # country name
    sName = "GIẤY CHỨNG MINH NHÂN DÂN"
    name = ""
    min = count_different_characters(name, sName)

    for color in range(60, 120, 5):
        s = getCardName(image, color)
        s = normalize_string(s)
        if len(s) > 15:
            count = count_different_characters(s, sName)
            if count < min:
                min = count
                name = s
            if count == 0:
                break

    return name


debug = False


def brute_force_id_number(image):
    # country name
    image = cv2.GaussianBlur(image, (3, 3), 0)
    lists = []
    for color in range(60, 120, 5):
        s = getIdNumber(image, color)
        s = re.sub("[\\D]", "", s)
        #         print(s)
        if len(s) == 9 or len(s) == 12:
            lists.append(s)

    return get_most_frequent(lists)


debug = False


def brute_force_name(image):
    # country name
    image = cv2.GaussianBlur(image, (3, 3), 0)
    lists = []
    for color in range(60, 120, 5):
        s = getFullname(image, color)
        s = normalize_string(s)
        if len(s) > 5:
            lists.append(s)

    return get_most_frequent(lists)


def normalize_dob(s):
    m = re.search("[\d-]+", s)
    if m:
        return m.group(0)
    return ""


def brute_force_dob(image):
    # country name
    image = cv2.GaussianBlur(image, (3, 3), 0)
    image = cropImage(image, 400, 300, 360, 40)
    image = utilsImage.imageResize(image, 150)
    cv2.imwrite("fsd.jpg", image)

    lists = []
    for color in range(60, 120, 5):
        s = getDateOfBirth(image, color)
        s = normalize_string(s)
        s = normalize_dob(s)
        if len(s) >= 10:
            lists.append(s)

    return get_most_frequent(lists)


debug = False


def brute_force_hometown(image):
    # country name
    image = cv2.GaussianBlur(image, (3, 3), 0)
    lists = []
    for color in range(60, 120, 5):
        s = getPlaceOfBirth(image, color)
        s = normalize_string(s)
        if len(s) > 20:
            lists.append(s)

    return get_most_frequent(lists)


debug = False


def brute_force_address(image):
    # country name
    image = cv2.GaussianBlur(image, (3, 3), 0)
    lists = []
    for color in range(60, 120, 5):
        s = getCurrentAddress(image, color)
        s = normalize_string(s)
        if len(s) > 20:
            lists.append(s)

    return get_most_frequent(lists)


# # Extract Id card Information


# get
def extractInfo(imagePath):
    # preprocessing
    image = resizeImageByWidth(cv2.imread(imagePath))
    res = {}
    res["img"] = imagePath

    res["countryName"] = brute_force_official_country_name(image)
    res["countryTitle"] = brute_force_official_country_title(image)
    res["cardName"] = brute_force_card_name(image)
    res["idNumber"] = brute_force_id_number(image)
    res["name"] = brute_force_name(image)
    res["dob"] = brute_force_dob(image)
    res["hometown"] = brute_force_hometown(image)
    res["address"] = brute_force_address(image)
    return res


if __name__ == "__main__":
    print("Starting extract information from image....")
    res = extractInfo("./verifyResults/2.jpg")
    print("Finish.")
    print(json.dumps(res, indent=4))

