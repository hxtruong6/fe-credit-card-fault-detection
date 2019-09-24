import cv2 as cv
import cv2
import numpy as np

# # height, width, number of channels in image
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
    resized = cv.resize(img, dim, interpolation = cv.INTER_AREA)
    return resized

def resizeImage(img, percent=100):
    scale_percent = percent # percent of original size
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    dim = (width, height)
    # resize image
    resized = cv.resize(img, dim, interpolation = cv.INTER_AREA)
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

def getGreenColor(img):
    # Convert BGR to HSV
    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
    # cv.imshow("hsv", hsv)
    # define range of blue color in HSV
    lower = np.array([40,0,0])
    upper = np.array([85,255,255])
    # Threshold the HSV image to get only blue colors
    mask = cv.inRange(hsv, lower, upper)
    # Bitwise-AND mask and original image
    res = cv.bitwise_and(img,img, mask= mask)
    green_img = cv.cvtColor(res, cv.COLOR_HSV2BGR)
    return green_img

def sharpImg(img):
    if len(img.shape)==3:
        img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    else:
        img_gray = img

    kernel_sharpening = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    # applying different kernels to the input image
    return cv.filter2D(img_gray, -1, kernel_sharpening)

def getGreenEdges(img):
    green_img = getGreenColor(img)
    cv.imshow('getGreenColor', green_img)
#     cv.waitKey(0)

    #     Sharpend edge image
    green_img = cv.cvtColor(green_img, cv.COLOR_BGR2GRAY)
    #     green_img = cv2.GaussianBlur(green_img, (3, 3), cv2.BORDER_DEFAULT)
    green_img = sharpImg(green_img)

    #     Make edge wider
    kernel = np.ones((7, 7), np.uint8)
    #     green_sharped = cv2.GaussianBlur(green_sharped, (3, 3), cv2.BORDER_DEFAULT)
    green_img = cv.dilate(green_img, kernel, iterations=2)

    #     Blur image
    green_img = cv2.GaussianBlur(green_img, (3, 3), cv2.BORDER_DEFAULT)
    #     cv.imshow('GaussianBlur', green_img)
    #     cv.waitKey(0)
    #     Get edges
    green_edges = cv.Canny(green_img, 50, 120)
#     cv.imshow('green_edges', green_edges)
#     cv.waitKey(0)
    return green_edges

def drawContourBoundary(img, cnt):
    M = cv.moments(cnt)
    #             print(M)
    if M['m00'] == 0:
        return

    cx = int(M['m10'] / M['m00'])
    cy = int(M['m01'] / M['m00'])

    # Find contour center to place text at the center
    shape_name = "Rectangle"
    cv.drawContours(img, [cnt], 0, (0, 0, 255), 2)
    cv.putText(img, shape_name, (cx - 50, cy), cv.FONT_HERSHEY_SIMPLEX, 1,
               (0, 0, 0), 1)
    cv.imshow('Identifying Shapes', img)
    cv.waitKey(0)

def getCardBorder(img):
    green_edges = getGreenEdges(img)
    contours, hierarchy = cv.findContours(green_edges, cv.RETR_EXTERNAL,
                                          cv.CHAIN_APPROX_SIMPLE)

    contours = sorted(contours, key=cv.contourArea, reverse=True)

    x = y = w = h = None
    for cnt in contours:
        # Get approximate polygons
        epsilon = 0.02 * cv.arcLength(cnt, True)
        approx = cv.approxPolyDP(cnt, epsilon, True)
        if len(approx) == 4:
#             print("Min area: ", cv.minAreaRect(cnt))
            x, y, w, h = cv.boundingRect(cnt)
            print("Boundary: ", cv.boundingRect(cnt))

            # Draw polygon
#             drawContourBoundary(img.copy(), cnt)            
            break
    return x, y, w, h

def croppingStandardImage(img, x, y, w, h, width=856):
    croppedImg = img[y:y + h, x:x + w]
    customSizeImg = imageResizeByWidth(croppedImg,)
    return customSizeImg

def savingImage(img, fileNamePath):
    cv.imwrite(fileNamePath, img)
    
    
def main():
    targetImagePath = 'data/4.jpg'

    # Load the target image with the shapes we're trying to match
    target = cv.imread(targetImagePath)
    target = resizeImage(target, 30)
    # target = imageResizeByWidth(target)
    # cv.imshow('Origin', target)

    img = target
    img = histogramEqualize(img)
    # cv.imshow('Equalize', img)

    x, y, w, h = getCardBorder(img)

    croppedTarget = croppingStandardImage(target, x, y, w, h)
    saveImage(croppedTarget, fileNamePath='./data/test.jpg')
    # cv.imshow('cropped Target ', croppedTarget)

    croppedEqualize = croppingStandardImage(img, x, y, w, h)
    saveImage(croppedEqualize, fileNamePath='./data/tempEqualize4.jpg')
    cv.imshow('cropped Equalize ', croppedEqualize)
    cv.waitKey(0)

    cv.destroyAllWindows()
    
if __name__ == '__main__':
    main()