const imageFile = document.querySelector('#image-file');
const translateBtn = document.querySelector('#translate-btn');

translateBtn.addEventListener('click', () => {
  if (imageFile.files.length === 0) {
    alert('Please select an image');
    return;
  }
  const file = imageFile.files[0];
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = () => {
    fetch(`/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ binaryImage: btoa(reader.result) }),
    }).then((res) => res.json());
  };
});
