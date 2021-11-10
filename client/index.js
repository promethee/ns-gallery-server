let hash = '';
let images = [];

const update_gallery = (images) => {
  console.info({ images });
  document.querySelector('#root').innerHTML = '';
  images.forEach(filename => {
    const imageContainerEl = document.createElement('div');
    imageContainerEl.setAttribute('class', 'image');
    const imageEl = document.createElement('img');
    imageEl.src = '/image/' + filename;
    imageEl.title = '/image/' + filename;
    imageContainerEl.appendChild(imageEl);
    document.querySelector('#root').appendChild(imageContainerEl);
  });
}

const update_data = async () => {
  const { ok } = await fetch(`/hash/${hash}`, { method: 'HEAD' });
  if (ok) return;
  const result = await fetch('/images');
  const data = await result.json();
  hash = data.hash;
  update_gallery(data.images);
};

setInterval(update_data, 60 * 1000);

document.addEventListener('DOMContentLoaded', update_data);
