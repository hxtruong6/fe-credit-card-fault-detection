// import FormData from 'form-data';
import { Platform } from 'react-native';
import axios from 'axios';
import config from '../../config';


const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('file', {
    name: photo.filename,
    uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const UploadImage = async function uploadImage(image) {
  if (!image) return;

  // let loading = true;
  const formData = createFormData(image);
  await axios
    .post(`${config.SERVER_URL}/image`, formData, {
      // responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onDownloadProgress(progressEvent) {
        console.log(
          'Download',
          progressEvent.loaded,
          progressEvent.total,
        );
      },
      onUploadProgress: (progressEvent) => console.log('Uploading: ', progressEvent.loaded),
    })
    .then((res) => {
      console.log('DETECT SUCCESS!! ', res);
      // const blob = new Blob([res.data], { type: 'image/*' });
      // const url = URL.createObjectURL(blob);
      // state.detectedImage = blob;
      // state.detectedUrl = url;
      // FileSaver.saveAs(blob, `prediction.jpg`);
    })
    .catch(() => {
      console.log('DETECT FAILURE!!');
    })
    .finally(() => {
      // loading = false;
      console.log('Finish detection.');
    });
};

module.exports = {
  UploadImage
};
