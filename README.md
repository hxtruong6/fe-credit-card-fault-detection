# fe-credit-card-fault-detection

> Project in Developer Circle (DevC) is sponsored by Facebook. The course is ogranized at CoderSchool. 
 The problem is selected among company in Vietnam which is of Fe-Credit.

## Sumary
For detection fake or real Vietnam identity card.

 - Input: the identity card image
 - Output: card fake or real

*Assumtion*: a straight image is considered template image. Not for distorted or dark or low resolution image.

*Result*: detect fake card on
  
   * card template: size, ratio size of card
   * profile image with a selfie image (user capture thier picture manually)
   * national emblem: just check with templage image
   * information of identity card: Id number, full name, day of birth, address
 
## Method
1. Card teamplate
_Border_ of card is main factor to verify. We find *border* of image then *crop* exactly follow by border to facilitate later steps.

To detect border, we filter image by _color_ (dark green) then get contour image. 

Result: 
![green_edges](https://user-images.githubusercontent.com/24609363/71159542-64283d00-2278-11ea-9bb9-0fe910816e6c.jpg)
![green_edges_color](https://user-images.githubusercontent.com/24609363/71159543-64283d00-2278-11ea-93e5-197a01c6576b.jpg)
![green_edges_mask](https://user-images.githubusercontent.com/24609363/71159546-65596a00-2278-11ea-89f4-9d003ce49e0f.jpg)

Cropped card: (example)
![1_134](https://user-images.githubusercontent.com/24609363/71180424-c4cd6f00-22a4-11ea-934c-e2cff53660d9.png)

2. Profile image
We crop profile image and apply some algorithms:
 * Profile image must be a person (not animal or stuff)
 * Person do not wear glasses
 * Person do not smile/laught ( kind of neutral)
 * Compare with selfie image 
 
3. National emblem
We crop national emblem from cropped card then using `opencv image template matching` to check
4. Information
Thank to the exactly cropped card, we again crop different area on image for extracting information. If a real card, it will has const ratio size so we can know where area has  the needed information (ex: card id, name, address,...)
![CardName](https://user-images.githubusercontent.com/24609363/71181658-2ee71380-22a7-11ea-8ad6-09ae52768d11.jpg)
![CardNameMask](https://user-images.githubusercontent.com/24609363/71181659-2ee71380-22a7-11ea-87da-65e20e0c12a5.jpg)
![IdName](https://user-images.githubusercontent.com/24609363/71181662-2f7faa00-22a7-11ea-84f9-05eb39142407.jpg)
![IdNameFilter](https://user-images.githubusercontent.com/24609363/71181663-2f7faa00-22a7-11ea-8778-34dcec7dd28a.jpg)
![fsd](https://user-images.githubusercontent.com/24609363/71181680-34dcf480-22a7-11ea-9c74-3f2dd8344e36.jpg)

Using `opencv ocr tesseract`, we will get information on card but it is not be exact. Image is filtered in many differnce range colors then we get the best result from previour filter color to apply OCR on that image by *frequently appear resutl*.
![card-detect-result](https://user-images.githubusercontent.com/24609363/71159675-afdae680-2278-11ea-8056-65acf7769d90.png)

## Application
To easily in checking fault card, we build a mobile app. Mobile app allow user take a picture of identity card then verify.

Application is an app for student participate the entry exam. So each student must be verify their identiy card to join the online test.

### UI & Result
![Screenshot_1570289047](https://user-images.githubusercontent.com/24609363/71158349-5c679900-2276-11ea-887c-c4d476983876.png)
![Screenshot_1570289050](https://user-images.githubusercontent.com/24609363/71158350-5c679900-2276-11ea-8165-2c4c46701fb5.png)
![Screenshot_1570289099](https://user-images.githubusercontent.com/24609363/71158351-5c679900-2276-11ea-9d88-92e23ced597f.png)
![Screenshot_1570289112](https://user-images.githubusercontent.com/24609363/71158352-5d002f80-2276-11ea-971a-bb472873dbf1.png)
![Screenshot_1570289119](https://user-images.githubusercontent.com/24609363/71158353-5d002f80-2276-11ea-99cb-17eae500efc7.png)
![Screenshot_1570289132](https://user-images.githubusercontent.com/24609363/71158354-5d98c600-2276-11ea-88f2-c467a37088b1.png)
![Screenshot_1570289807](https://user-images.githubusercontent.com/24609363/71158923-5cb46400-2277-11ea-98f7-967a86f3ae3c.jpg)
![Screenshot_1570290096](https://user-images.githubusercontent.com/24609363/71158357-5d98c600-2276-11ea-8b4a-f3a2bf210228.png)
![Screenshot_1570290322](https://user-images.githubusercontent.com/24609363/71158358-5e315c80-2276-11ea-8396-2e477acff0c0.png)

