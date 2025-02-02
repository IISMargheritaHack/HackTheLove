import { getPhotos } from '@api/api';



async function readImage(arrayBuffer) {
  try {
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Cambia il tipo se necessario
    const imageUrl = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.margin = '10px';

    let div = document.getElementsByTagName('div');
    div[0].appendChild(img);
  } catch (error) {
    console.error('Errore nella visualizzazione dell\'immagine:', error);
  }
}


async function getImages() {
  const images = await getPhotos();
  if (images.length > 0) {
    for (const image of images) {
      const binaryData = Uint8Array.from(atob(image), c => c.charCodeAt(0)).buffer;
      await readImage(binaryData);
    }
  }
}

export { getImages };
