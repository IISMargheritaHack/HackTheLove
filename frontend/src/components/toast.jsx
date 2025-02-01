import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const showToast = (message, type) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'center',
    style: {
      background: type === 'error' ? 'red' : 'green',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: 'bold',
    },
  }).showToast();
};