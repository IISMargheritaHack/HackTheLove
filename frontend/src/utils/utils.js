import { getPhotos } from '@api/api';

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function readImage(arrayBuffer, containerId = 'image-container') {
  try {
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.margin = '10px';

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }

    container.appendChild(img);

    img.onload = () => URL.revokeObjectURL(imageUrl);
  } catch (error) {
    console.error("Error displaying image:", error);
  }
}

async function getImages(containerId = 'image-container') {
  try {
    const images = await getPhotos();
    if (!images || images.length === 0) {
      console.warn('No images found.');
      return;
    }

    const imageBuffers = images.map(image => base64ToArrayBuffer(image));

    await Promise.all(imageBuffers.map(buffer => readImage(buffer, containerId)));
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

export { getImages };
