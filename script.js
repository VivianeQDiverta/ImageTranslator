const imageFile = document.querySelector('#image-file');
const translateBtn = document.querySelector('#translate-btn');
const targetLang = document.querySelector('#target-lang');
const translateBtnSpinner = document.querySelector('#translate-btn-spinner');

translateBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (imageFile.files.length === 0) {
    alert('Please select an image');
    return;
  }
  // disable all inputs
  translateBtnSpinner.classList.remove('d-none');
  imageFile.disabled = true;
  targetLang.disabled = true;
  translateBtn.disabled = true;

  // read file
  const file = imageFile.files[0];
  const binaryImage = await new Promise((resolve) => {
    const reader = new FileReader();
    if (file.type !== 'image/svg+xml' && file.type !== 'image/png') {
      // convert file to binary string
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    }

    // convert images to jpg if svg or png
    const imgObj = new Image();
    imgObj.src = URL.createObjectURL(file);
    imgObj.onload = () => {
      URL.revokeObjectURL(imgObj.src); // free up memory
      const canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      canvas.width = imgObj.width;
      canvas.height = imgObj.height;
      // fill canvas with white background
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // draw image on top of background
      ctx.drawImage(imgObj, 0, 0);

      // convert canvas containing converted image to binary string
      canvas.toBlob((blob) => {
        reader.readAsBinaryString(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      }, 'image/jpg');
    };
  });

  // send request
  const res = await fetch(`/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/html',
    },
    body: JSON.stringify({
      binaryImage: btoa(binaryImage),
      targetLang: targetLang.value,
    }),
  });

  // parse response
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  document
    .querySelector('body')
    .replaceChild(
      doc.querySelector('#main-container'),
      document.querySelector('#main-container')
    );
});

const displayTranslation = async (translationId, token) => {
  const res = await fetch(`/translate?translationId=${translationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
      Authorization: `Bearer ${token}`,
    },
  });

  // parse response
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  document
    .querySelector('body')
    .replaceChild(
      doc.querySelector('#main-container'),
      document.querySelector('#main-container')
    );
};

// handle translation display on page load if requested
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const translationId = new URLSearchParams(window.location.search).get(
    'translationId'
  );
  if (translationId) {
    if (!token) {
      window.location.href = '/signin';
    } else {
      displayTranslation(translationId, token);
    }
  }
});
