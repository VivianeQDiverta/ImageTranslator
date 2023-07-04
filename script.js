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
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  const binaryImage = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      resolve(reader.result);
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
  })

  // parse response
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  document.querySelector('body').innerHTML = doc.querySelector('body').innerHTML;
});
