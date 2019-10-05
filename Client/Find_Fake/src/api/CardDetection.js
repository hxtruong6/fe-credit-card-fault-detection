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

const GetCardImage = (filename) => {
  // return 'data:image/png;base64,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';
  const link = `${config.SERVER_URL}/get_card`;
  console.log('xxx 242 link: ', link);
  // send http request in a new thread (using native code)
  return RNFetchBlob.fetch('GET', link)
    .then((res) => {
      const { status } = res.info();

      if (status == 200) {
        console.log('xxx 243 res: ', res);

        // the conversion is done in native code
        const uri = `data:image/jpg;base64,${res.base64()}`;
        // const uri = res.base64();

        // the following conversions are done in js, it's SYNC
        // const text = res.text();
        // const json = res.json();
        // console.log('xxx 243.1 base 64: ', base64Str);
        // resolve(uri);
        return uri;
        // return card;
        // console.log('xxx 243.2 t: ', text);
        // console.log('xxx 243.3 json: ', json);
      }
      // rejects('Get card NOT success');
      console.log('Get card NOT success');
    })
    // Something went wrong:
    .catch((errorMessage, statusCode) =>
      // error handling
      console.log('Status code: ', statusCode, '\nGet card error: ', errorMessage)
      // reject(new Error('Status code: ', statusCode, '\nGet card error: ', errorMessage));
    );
  // await axios({
  //   method: 'post',
  //   url: link,
  //   responseType: 'blob',
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  //   .then((res) => {
  //     console.log("xxx res: ", res)
  //     const blob = new Blob([res.data], { type: 'image/*' });
  //     const objectURL = URL.createObjectURL(blob);
  //     const file = new File([blob], `${filename}.jpg`, {
  //       type: 'image/jpg',
  //     });
  //     const card = {
  //       url: objectURL,
  //       image: file
  //     };
  //     console.log('xxx243 get card image: ', card);
  //     console.log('Get card success: ', res);
  //     return card;
  //   })
  //   .catch((error) => (console.log('Get card error: ', error)))
  //   .finally(() => {
  //     console.log('Finish get card.');
  //   });
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

// GetCardImage('1');

export {
  UploadImage, GetCardImage, VerifyCard
};
