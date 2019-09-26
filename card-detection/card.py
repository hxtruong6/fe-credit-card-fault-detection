from utilsImage import *

# kích thước 85,6 mm x 53,98 mm
STANDARD_WIDTH = 856
STANDARD_HEIGHT = 539.8
STANDARD_W_H_SIZE_RATIO = STANDARD_WIDTH / STANDARD_HEIGHT


class Card:
    def __init__(self, originImage):
        self.originImage = originImage
        self.image = None

    def __str__(self):
        return str(self.__class__) + ": " + str(self.__dict__)

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
        contours, hierarchy = cv2.findContours(green_edges, cv2.RETR_EXTERNAL,
                                               cv2.CHAIN_APPROX_SIMPLE)

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
            self.image = croppingStandardImage(self.originImage,
                                               x,
                                               y,
                                               w,
                                               h,
                                               width=STANDARD_WIDTH)
            return True
        return False

    def isStandardSizeRatio(self,
                            threshold=0.1,
                            standard_w_h=STANDARD_W_H_SIZE_RATIO):
        h, w = self.image.shape[:2]
        self.width_height_ratio = w / h
        return abs(self.width_height_ratio - standard_w_h) <= threshold

    def cropQh(self, qhThreshold=10):
        minX = 70
        minY = 50
        qhDiameter = 180  # quoc huy co duong kinh la 14mm

        self.originQh = self.image[minY - qhThreshold:minY + qhDiameter +
                                   qhThreshold, minX - qhThreshold:minX +
                                   qhDiameter + qhThreshold]
        return self.originQh

    def isExsitQhContour(self):
        def getQhColor(img):
            # Convert BGR to HSV
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            #     showImg(hsv, "color")
            # cv.imshow("hsv", hsv)
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
            return qh[cY - rQh:cY + rQh, cX - rQh:cX + rQh]

        self.cropQh()
        self.colorQh = getQhColor(self.originQh)
        self.grayQh = cv2.cvtColor(self.colorQh, cv2.COLOR_BGR2GRAY)
        originQhThresh = getEdgeImage(self.grayQh)

        # ret, originQhThresh = cv2.threshold(qh_gray, 127, 255, 0)

        # Extract contours from second target image
        contours, hierarchy = cv2.findContours(originQhThresh,
                                               cv2.RETR_EXTERNAL,
                                               cv2.CHAIN_APPROX_NONE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        print("Length contours of QH: ", len(contours))

        self.qhCountour = None
        if len(contours) == 1:
            self.qhCountour = contours[0]
            self.standardQh = cropStandardQh(self.originQh, self.qhCountour)
        else:
            return False
        return True

    def isMatchQhTemplate(self,
                          thresholdMatch=0.1,
                          method='cv2.TM_CCOEFF_NORMED'):
        # Getting quoc huy
        self.templateQh = cv2.imread('standardQhTemplate.png')
        self.templateGrayQh = cv2.cvtColor(self.templateQh, cv2.COLOR_BGR2GRAY)

        try:
            self.grayQh
        except NameError:
            self.grayQh = None

        if self.grayQh is None:
            if not self.isExsitQhContour():
                print("Not exsit contour")
                return False

        method = eval(method)
        # Apply template Matching
        res = cv2.matchTemplate(self.grayQh, self.templateGrayQh, method)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

        if min_val > thresholdMatch:
            print("Min Val: ", min_val)
            return False
        return True
