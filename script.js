const imageFile = document.querySelector('#image-file');
const translateBtn = document.querySelector('#translate-btn');
const targetLang = document.querySelector('#target-lang');

translateBtn.addEventListener('click', () => {
  if (imageFile.files.length === 0) {
    alert('Please select an image');
    return;
  }
  const file = imageFile.files[0];
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = () => {
    fetch(`/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify({
        binaryImage: btoa(reader.result),
        targetLang: targetLang.value,
      }),
    })
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        document.querySelector('body').innerHTML =
          doc.querySelector('body').innerHTML;
      });
  };
});
