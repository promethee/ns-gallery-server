const { readdirSync, readFileSync } = require('fs');
const { send } = require('micro');
const spark = require('spark-md5');

let hash = '';
let images = [];
let cache = {};
const extensions = ['jpg', 'jpeg', 'png', 'webp'];

const client = ['html', 'css', 'js']
  .reduce((acc, ext) => ({ ...acc, [ext]: readFileSync(`./client/index.${ext}`, 'utf8') }), {});

const getFileFromUrl = url => url.split('/').filter((chunk, i) => i > 0 && chunk.length)[1];
const getFileExtension = filename => filename.split('.').reverse()[0]
const filterExtensions = filename => extensions.includes(getFileExtension(filename));

const updateImagesList = () => {
  readdirSync('./data/')
    .filter(filterExtensions)
    .forEach(image => !images.includes(image) && images.push(image));
  const last_hash = spark.hash(JSON.stringify(images));
  if (last_hash === hash) return;
  hash = last_hash;
  cache = {};
  images.forEach(filename => {
    cache[filename] = readFileSync(`./data/${filename}`);
  });
};

updateImagesList();
setInterval(updateImagesList, 60 * 1000);

module.exports = (req, res) => {
  const { headers, url, method } = req;
  if (url.includes('/hash')) {
    const _hash = getFileFromUrl(url);
    console.info({ _hash, url });
    send(res, hash === _hash ? 200 : 400);
  }
  if (method !== 'GET') send(res, 400);
  if (url === '/images') res.end(JSON.stringify({ hash, images }));
  if (url.includes('/image')) send(res, 200, cache[getFileFromUrl(url)]);
  if (url === '/' && headers.accept.includes('text/html')) res.end(client.html);
  if (url.includes('/client/')) {
    res.end(client[getFileExtension(getFileFromUrl(url))]);
  } else {
    send(res, 204);
  }
}
