from utilsImage import *
import os

# kích thước 85,6 mm x 53,98 mm
STANDARD_WIDTH = 856
STANDARD_HEIGHT = 539.8
STANDARD_W_H_SIZE_RATIO = STANDARD_WIDTH / STANDARD_HEIGHT
VERIFY_RESULT_FOLDER = "./verifyResults/"


class Card:
    def __init__(self, originImage):
        self.originImage = originImage
        self.image = None
        self.isFake = False

    def __str__(self):
        return str(self.__class__) + ": " + str(self.__dict__)

    def getCard(self, fileName):
        #    Check self.image not define
        if ".jpg" not in fileName:
            fileName = fileName + ".jpg"
        fileName = os.path.join(VERIFY_RESULT_FOLDER, fileName)
        savingImage(self.image, fileName)
        return fileName

    def getCardWithFakeBounding(self, fileName):
        if not self.isFake:
            return "Not fake card"
        if ".jpg" in fileName:
            fileName = fileName[: len(fileName) - 4]
        fileName = os.path.join(VERIFY_RESULT_FOLDER, fileName + "_face_bounding.jpg")
        savingImage(self.image, fileName)
        return fileName

    def getGreenColor(self, img):
        # Convert BGR to HSV
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        # cv2.imshow("hsv", hsv)
        # define range of blue color in HSV
        lower = np.array([40, 0, 0])
        upper = np.array([85, 255, 255])
        # Threshold the HSV image to get only blue colors
        mask = cv2.inRange(hsv, lower, upper)
        # Bitwise-AND mask and original image
        res = cv2.bitwise_and(img, img, mask=mask)
        res = cv2.cvtColor(res, cv2.COLOR_HSV2BGR)
        return res

    def getGreenEdges(self, img):
        green_img = self.getGreenColor(img)

        #     Sharpend edge image
        green_img = cv2.cvtColor(green_img, cv2.COLOR_BGR2GRAY)
        #     green_img = cv2.GaussianBlur(green_img, (3, 3), cv2.BORDER_DEFAULT)
        green_img = sharpImg(green_img)

        #     Make edge wider
        kernel = np.ones((7, 7), np.uint8)
        #     green_sharped = cv2.GaussianBlur(green_sharped, (3, 3), cv2.BORDER_DEFAULT)
        green_img = cv2.dilate(green_img, kernel, iterations=2)

        #     Blur image
        green_img = cv2.GaussianBlur(green_img, (3, 3), cv2.BORDER_DEFAULT)
        #     Get edges
        green_edges = cv2.Canny(green_img, 50, 120)
        return green_edges

    def getCardBorder(self, img):
        img = histogramEqualize(img)
        green_edges = self.getGreenEdges(img)
        contours, hierarchy = cv2.findContours(
            green_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        contours = sorted(contours, key=cv2.contourArea, reverse=True)

        x = y = w = h = None
        for cnt in contours:
            # Get approximate polygons
            epsilon = 0.02 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            if len(approx) == 4:
                #             print("Min area: ", cv2.minAreaRect(cnt))
                x, y, w, h = cv2.boundingRect(cnt)
                print("Boundary: ", cv2.boundingRect(cnt))

                # Draw polygon
                #             drawContourBoundary(img.copy(), cnt)
                break
        return x, y, w, h

    def isExsitBorder(self):
        x, y, w, h = self.getCardBorder(self.originImage)
        if x != None and y != None and w != None and h != None:
            self.border = (x, y, w, h)
            self.image = croppingStandardImage(
                self.originImage, x, y, w, h, width=STANDARD_WIDTH
            )
            return True
        self.isFake = True
        return False

    def isStandardSizeRatio(self, threshold=0.1, standard_w_h=STANDARD_W_H_SIZE_RATIO):
        h, w = self.image.shape[:2]
        self.width_height_ratio = w / h

        if abs(self.width_height_ratio - standard_w_h) <= threshold:
            return True

        self.isFake = True
        return False

    def cropQh(self, qhThreshold=10):
        minX = 70
        minY = 50
        qhDiameter = 180  # quoc huy co duong kinh la 14mm

        self.originQh = self.image[
            minY - qhThreshold : minY + qhDiameter + qhThreshold,
            minX - qhThreshold : minX + qhDiameter + qhThreshold,
        ]
        return self.originQh

    def cropProfileImage(self, threshold=10):
        minX = 35
        minY = 210
        w = 220
        h = 290
        self.profileImage = self.image[
            minY - threshold : minY + h + threshold,
            minX - threshold : minX + w + threshold,
        ]
        return self.profileImage

    def isExsitQhContour(self):
        def getQhColor(img):
            # Convert BGR to HSV
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            #     showImg(hsv, "color")
            # cv2.imshow("hsv", hsv)
            # define range of color in HSV

            ## Gen lower mask (0-5) and upper mask (175-180) of RED
            mask1 = cv2.inRange(hsv, (0, 50, 20), (35, 255, 255))
            mask2 = cv2.inRange(hsv, (170, 50, 20), (180, 255, 255))

            ## Merge the mask and crop the red regions
            mask = cv2.bitwise_or(mask1, mask2)

            res = cv2.bitwise_and(img, img, mask=mask)
            res = cv2.cvtColor(res, cv2.COLOR_HSV2BGR)
            return res

        def getEdgeImage(img):
            kernel = np.ones((1, 1), np.uint8)
            img = cv2.dilate(img, kernel, iterations=1)
            #     showImg(img, 'edge enhance QH')
            img = cv2.GaussianBlur(img, (3, 3), cv2.BORDER_DEFAULT)
            # showImg(img, 'edge blur QH')

            # Get edges
            edges = cv2.Canny(img, 50, 120)
            # showImg(qhEdges, 'edge QH')
            return edges

        def cropStandardQh(qh, qhCountour, rQh=71):
            # calculate moments of binary image
            M = cv2.moments(qhCountour)

            # calculate x,y coordinate of center
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
            return qh[cY - rQh : cY + rQh, cX - rQh : cX + rQh]

        self.cropQh()
        self.colorQh = getQhColor(self.originQh)
        self.grayQh = cv2.cvtColor(self.colorQh, cv2.COLOR_BGR2GRAY)
        originQhThresh = getEdgeImage(self.grayQh)

        # ret, originQhThresh = cv2.threshold(qh_gray, 127, 255, 0)

        # Extract contours from second target image
        contours, hierarchy = cv2.findContours(
            originQhThresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE
        )
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        print("Length contours of QH: ", len(contours))

        self.qhCountour = None
        if len(contours) == 1:
            self.qhCountour = contours[0]
            self.standardQh = cropStandardQh(self.originQh, self.qhCountour)
        else:
            self.isFake = True
            return False
        return True

    def isMatchQhTemplate(self, thresholdMatch=0.1, method="cv2.TM_CCOEFF_NORMED"):
        # Getting quoc huy
        self.templateQh = cv2.imread("standardQhTemplate.png")
        self.templateGrayQh = cv2.cvtColor(self.templateQh, cv2.COLOR_BGR2GRAY)

        try:
            self.grayQh
        except NameError:
            self.grayQh = None

        if self.grayQh is None:
            if not self.isExsitQhContour():
                print("Not exsit contour")
                self.isFake = True
                return False

        method = eval(method)
        # Apply template Matching
        res = cv2.matchTemplate(self.grayQh, self.templateGrayQh, method)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

        if min_val > thresholdMatch:
            print("Min Val: ", min_val)
            self.isFake = True
            return False
        return True

    # Kiểm tra ảnh trên CMND có chứa khuôn mặt của người
    # True: có đúng 1 khuôn mặt người
    # False: không có hoặc có nhiều hơn 1 khuôn mặt người
    def check_human_face(self):
        if len(fr.face_locations(self.profileImage, model="cnn")) != 1:
            return False
        else:
            return True

    # Kiểm tra xem khuôn mặt trong ảnh CMND có chính diện hay không (không quá lệch qua trái, phải)
    # True: khuôn mặt chính diện
    # False: khuôn mặt bị lệch trái, phải.
    def check_face_direction(self):
        face_landmarks = fr.face_landmarks(self.profileImage)
        dist_1 = euclidean(
            face_landmarks[0]["left_eye"][3], face_landmarks[0]["nose_bridge"][0]
        )
        dist_2 = euclidean(
            face_landmarks[0]["right_eye"][0], face_landmarks[0]["nose_bridge"][0]
        )

        if 0.75 <= (dist_1 / dist_2) <= 1.25:
            if (
                0.8
                <= (
                    face_landmarks[0]["left_eye"][3][1]
                    / face_landmarks[0]["right_eye"][0][1]
                )
                <= 1.2
            ):
                return True
            else:
                self.isFake = True
                return False
        else:
            return False

    # Kiểm tra xem khuôn mặt trong ảnh CMND có nhắm mắt hay không
    # True: nhắm mắt
    # False: mở mắt
    def check_eye_closed(self):
        face_landmarks = fr.face_landmarks(self.profileImage)
        dist_1 = euclidean(
            face_landmarks[0]["left_eye"][1], face_landmarks[0]["left_eye"][5]
        )
        dist_2 = euclidean(
            face_landmarks[0]["left_eye"][2], face_landmarks[0]["left_eye"][4]
        )
        dist_3 = euclidean(
            face_landmarks[0]["left_eye"][0], face_landmarks[0]["left_eye"][3]
        )

        dist_4 = euclidean(
            face_landmarks[0]["right_eye"][1], face_landmarks[0]["right_eye"][5]
        )
        dist_5 = euclidean(
            face_landmarks[0]["right_eye"][2], face_landmarks[0]["right_eye"][4]
        )
        dist_6 = euclidean(
            face_landmarks[0]["right_eye"][0], face_landmarks[0]["right_eye"][3]
        )

        ear_1 = (dist_1 + dist_2) / (2 * dist_3)
        ear_2 = (dist_4 + dist_5) / (2 * dist_6)

        if ear_1 <= 0.3 or ear_2 <= 0.3:
            self.isFake = True
            return True
        else:
            return False

    # Kiểm tra xem khuôn mặt trong ảnh CMND có hé môi (mở miệng) hay không
    # True: hé môi
    # False: không hé môi
    def check_lip_opened(self):
        face_landmarks = fr.face_landmarks(self.profileImage)
        if (
            0.97
            <= face_landmarks[0]["top_lip"][-4][1]
            / face_landmarks[0]["bottom_lip"][-4][1]
            <= 1.07
        ):
            return False
        else:
            self.isFake = True
            return True

    # Kiểm tra khuôn mặt trong ảnh CMND có khớp với khuôn mặt của khách hàng
    # True: khớp
    # False: không khớp
    def check_matched_faces(self, real_img, card_img):
        real_img_encoding = fr.face_encodings(real_img)[0]
        card_img_encoding = fr.face_encodings(card_img)[0]

        if fr.compare_faces([real_img_encoding], card_img_encoding)[0]:
            return True
        self.isFake = True
        return False

    # Kiểm tra khuôn mặt trong ảnh CMND có đeo kính
    # True: đeo kính
    # False: không đeo kính
    def check_eyeglasses(self):
        img = self.profileImage
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.GaussianBlur(img, (11, 11), 0)

        sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=-1)
        sobel_y = cv2.convertScaleAbs(sobel_y)
        edgeness = sobel_y

        retVal, thresh = cv2.threshold(
            edgeness, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        d = len(thresh) * 0.5
        x = np.int32(d * 6 / 7)
        y = np.int32(d * 3 / 4)
        w = np.int32(d * 2 / 7)
        h = np.int32(d * 2 / 4)

        x_2_1 = np.int32(d * 1 / 4)
        x_2_2 = np.int32(d * 5 / 4)
        w_2 = np.int32(d * 1 / 2)
        y_2 = np.int32(d * 8 / 7)
        h_2 = np.int32(d * 1 / 2)

        roi_1 = thresh[y : y + h, x : x + w]
        roi_2_1 = thresh[y_2 : y_2 + h_2, x_2_1 : x_2_1 + w_2]
        roi_2_2 = thresh[y_2 : y_2 + h_2, x_2_2 : x_2_2 + w_2]
        roi_2 = np.hstack([roi_2_1, roi_2_2])

        measure_1 = sum(sum(roi_1 / 255)) / (np.shape(roi_1)[0] * np.shape(roi_1)[1])
        measure_2 = sum(sum(roi_2 / 255)) / (np.shape(roi_2)[0] * np.shape(roi_2)[1])
        measure = measure_1 * 0.3 + measure_2 * 0.7

        if measure > 0.15:
            self.isFake = True
            return True
        else:
            return False

    # 0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 4: 'Sad', 5: 'Surprise', 6: 'Neutral'
    def check_emotion(self):
        return True
        # img = self.profileImage
        # json_file = open("./emotionModel/fer.json", "r")
        # loaded_model_json = json_file.read()
        # json_file.close()
        
        # classifier = model_from_json(loaded_model_json)
        # classifier.load_weights("./emotionModel/fer.h5")

        # face = fr.face_locations(img, model="cnn")[0]
        # top, right, bottom, left = face

        # roi = img[top:bottom, left:right]
        # roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

        # cropped_img = np.expand_dims(
        #     np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0
        # )
        # cv2.normalize(
        #     cropped_img,
        #     cropped_img,
        #     alpha=0,
        #     beta=1,
        #     norm_type=cv2.NORM_L2,
        #     dtype=cv2.CV_32F,
        # )

        # if np.argmax(classifier.predict(cropped_img)) == 6:
        #     return True
        # else:
        #     self.isFake = True
        #     return False
