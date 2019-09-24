import cv2
import numpy as np

class Card():
    def __init__(self, originImage):
        self.originImage = originImage
    
    def getGreenColor(img):
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


