import FormData from 'form-data';
import { Platform } from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
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

const GetCardImage = (filename) => {
  const link = `${config.SERVER_URL}/get_card`;
  return RNFetchBlob.fetch('GET', link)
    .then((res) => {
      const { status } = res.info();

      if (status == 200) {
        const uri = `data:image/jpg;base64,${res.base64()}`;
        return uri;
      }
      console.log('Get card NOT success');
    })
    .catch((errorMessage, statusCode) =>
      console.log('Status code: ', statusCode, '\nGet card error: ', errorMessage)
    );
};

// TODO: pass file name is id card as parameter
const VerifyCard = (filename) => {
  return axios({
    method: 'post',
    url: `${config.SERVER_URL}/verify`,
    data: { filename },
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then((response) => {
      console.log('Verify card success: ', response)
      return response.data;
    })
    .catch((error) => (console.log('Verify card error: ', error)))
    .finally(() => {
      console.log('Finish verify.');
    });
};

export {
  UploadImage, GetCardImage, VerifyCard
};
