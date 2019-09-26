import cv2
import numpy as np
import random
import sys
from matplotlib import pyplot as plt
from skimage.measure import compare_ssim
import imutils

# height, width, number of channels in image
# height = img.shape[0]
# width = img.shape[1]
# channels = img.shape[2]
def imageResizeByWidth(img, width=856):
    currRatio = img.shape[0]/img.shape[1]
    print('Shape: ', img.shape)
    height = int(width * currRatio)
    dim = (width, height)
    print('Resized shape: ', dim)
    # resize image
    resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    return resized

def imageResize(img, percent=100):
    scale_percent = percent # percent of original size
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    dim = (width, height)
    # resize image
    resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    return resized

def histogramEqualize(img):
    #-----Converting image to LAB Color model-----------------------------------
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    # cv2.imshow("lab",lab)

    #-----Splitting the LAB image to different channels-------------------------
    l, a, b = cv2.split(lab)
    # cv2.imshow('l_channel', l)
    # cv2.imshow('a_channel', a)
    # cv2.imshow('b_channel', b)

    #-----Applying CLAHE to L-channel-------------------------------------------
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    #     cv2.imshow('CLAHE output', cl)

    #-----Merge the CLAHE enhanced L-channel with the a and b channel-----------
    limg = cv2.merge((cl, a, b))
    #     cv2.imshow('limg', limg)

    #-----Converting image from LAB Color model to RGB model--------------------
    final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    #     cv2.imshow('final', final)

    #     cv2.waitKey(0)
    #     cv2.destroyAllWindows()
    return final

def sharpImg(img):
    if len(img.shape)==3:
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        img_gray = img

    kernel_sharpening = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    # applying different kernels to the input image
    return cv2.filter2D(img_gray, -1, kernel_sharpening)

def croppingStandardImage(img, x, y, w, h, width=856):
    croppedImg = img[y:y + h, x:x + w]
    customSizeImg = imageResizeByWidth(croppedImg, )
    return customSizeImg

def drawContourBoundary(img, cnt):
    M = cv2.moments(cnt)
    #             print(M)
    if M['m00'] == 0:
        return

    cx = int(M['m10'] / M['m00'])
    cy = int(M['m01'] / M['m00'])

    # Find contour center to place text at the center
    shape_name = "Rectangle"
    cv2.drawContours(img, [cnt], 0, (0, 0, 255), 2)
    cv2.putText(img, shape_name, (cx - 50, cy), cv2.FONT_HERSHEY_SIMPLEX, 1,
               (0, 0, 0), 1)
    cv2.imshow('Identifying Shapes', img)
    cv2.waitKey(0)

def savingImage(img, fileNamePath):
    cv2.imwrite(fileNamePath, img)

def showingImg(img, title = str(round(random.random()*1000,0))):
    cv2.imshow(title, img)
    cv2.waitKey(0)
    cv2.destroyWindow(title)
    
    

def main():
    print('This is Utils image modules')

if __name__ == '__main__':
    main()