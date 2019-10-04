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

const UploadImage = function uploadImage(image) {
  if (!image) return;

  // let loading = true;
  const formData = createFormData(image);
  console.log('xxx 011 formdata: ', formData);
  axios({
    method: 'post',
    url: `${config.SERVER_URL}/upload`,
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
    .then((response) => console.log(response))
    .catch((errors) => console.log(errors))
    .finally(() => {
      console.log('Finish upload.');
    });
};

const GetCard = (filename) => {
  const card = {
    url: '',
    image: ''
  };

  const link = `${config.SERVER_URL}/get_card`;
  fetch(link)
    .then((res) => res.blob()) // Gets the response and returns it as a blob
    .then((blob) => {
      const objectURL = URL.createObjectURL(blob);
      const file = new File([blob], `${filename}.jpg`, {
        type: 'image/jpg',
      });

      card.url = objectURL;
      card.image = file;
    });
  return card;
};

module.exports = {
  UploadImage, GetCard
};
