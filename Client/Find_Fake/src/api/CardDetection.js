import FormData from 'form-data';
import { Platform } from 'react-native';
import axios from 'axios';
import config from '../../config';


const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('file', {
    name: `${photo.filename}.jpg`,
    uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    type: 'image/jpg',
  });
  if (body) {
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  }
  return data;
};

const UploadImage = async (image) => {
  if (!image) return;
  const formData = createFormData(image);
  console.log('xxx 011 formdata: ', formData);

  await axios({
    method: 'post',
    url: `${config.SERVER_URL}/upload`,
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
    .then((response) => (console.log(response)))
    .catch((error) => (console.log(error)))
    .finally(() => {
      console.log('Finish upload.');
    });
};

const GetCardImage = async (filename) => {
  const link = `${config.SERVER_URL}/get_card`;
  console.log('xxx 242 link: ', link);
  await axios({
    method: 'post',
    url: link,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
    .then((res) => {
      console.log("xxx res: ", res)
      const blob = new Blob([res.data], { type: 'image/*' });
      const objectURL = URL.createObjectURL(blob);
      const file = new File([blob], `${filename}.jpg`, {
        type: 'image/jpg',
      });
      const card = {
        url: objectURL,
        image: file
      };
      console.log('xxx243 get card image: ', card);
      console.log('Get card success: ', res);
      return card;
    })
    .catch((error) => (console.log('Get card error: ', error)))
    .finally(() => {
      console.log('Finish get card.');
    });
  // return fetch(link)
  //   .then((res) => {
  //     console.log('xxx 242.5 res: ', res);
  //     return res.blob();
  //   }) // Gets the response and returns it as a blob
  //   .then((blob) => {
  //     if (!blob) {
  //       return Promise.reject(new Error('No card is detected from server'));
  //     }
  //     const objectURL = URL.createObjectURL(blob);
  //     const file = new File([blob], `${filename}.jpg`, {
  //       type: 'image/jpg',
  //     });
  //     const card = {
  //       url: objectURL,
  //       image: file
  //     };
  //     console.log('xxx243 get card image: ', card);
  //     return card;
  //   })
  //   .catch((error) => Promise.reject(new Error('Get card image: ', error)));
};

// TODO: pass file name is id card as parameter
const VerifyCard = async (filename) => {
  await axios({
    method: 'post',
    url: `${config.SERVER_URL}/verify`,
    data: { filename },
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then((response) => (console.log('Verify card success: ', response)))
    .catch((error) => (console.log('Verify card error: ', error)))
    .finally(() => {
      console.log('Finish verify.');
    });
};

GetCardImage('1');

export {
  UploadImage, GetCardImage, VerifyCard
};
