;

const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');

async function downloadImage(url) {
  const path = Path.resolve(__dirname, 'images', 'code.jpg');
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
const url = 'http://127.0.0.1:5000/get_card'
downloadImage(url);
