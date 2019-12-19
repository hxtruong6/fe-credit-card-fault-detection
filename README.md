# fe-credit-card-fault-detection

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
2. Profile image
3. National emblem
4. Information

## Application
To easily in checking fault card, we build a mobile app. Mobile app allow user take a picture of identity card then verify.

Application is an app for student participate the entry exam. So each student must be verify their identiy card to join the online test.

### UI
