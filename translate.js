// observe for body changes
const body = document.querySelector('body');

// observe body for childList changes and add listeners if #result is added
const observer = new MutationObserver(() => {
  const annotationsContainer = document.querySelector('.annotationsContainer');
  if (!document.getElementById('result') || !annotationsContainer) return;

  const showAnnotationsSwitch = document.getElementById('show-annotations');
  const downloadButton = document.getElementById('download-btn');
  const saveButton = document.getElementById('save-btn');

  // Show or hide annotations depending on switch state
  showAnnotationsSwitch.addEventListener('change', (event) => {
    toggleAnnotations(annotationsContainer, event.target.checked);
  });

  // add click handler to show/hide each annotation individually
  annotationsContainer.childNodes.forEach((annotation) => {
    annotation.addEventListener('click', () =>
      annotationClickHandler(annotation)
    );
  });

  // add click handler to download button
  downloadButton.addEventListener('click', downloadClickHandler);
  saveButton.addEventListener('click', saveClickHandler);
});

observer.observe(body, { childList: true });

const toggleAnnotations = async (annotationsContainer, checked) => {
  annotationsContainer.style.display = checked ? 'block' : 'none';
};

const annotationClickHandler = (annotation) => {
  annotation.style.opacity = annotation.style.opacity === '0' ? '1' : '0';
};

const computeResultSize = (minWidth, minHeight) => {
  const annotations = document.querySelector(
    '.annotationsContainer'
  ).childNodes;
  const { width, height } = Array.from(annotations).reduce(
    (acc, annotation) => {
      const top = parseInt(annotation.style.top.replace('px', ''));
      const left = parseInt(annotation.style.left.replace('px', ''));
      const bottom = top + annotation.offsetHeight;
      const right = left + annotation.offsetWidth;
      return {
        width: right > acc.width ? right : acc.width,
        height: bottom > acc.height ? bottom : acc.height,
      };
    },
    { width: minWidth, height: minHeight }
  );
  return { width, height };
};

const downloadClickHandler = () => {
  const resultDiv = document.getElementById('result');
  // adjust result div size to fit all annotations
  const { width, height } = computeResultSize(
    resultDiv.offsetWidth,
    resultDiv.offsetHeight
  );
  resultDiv.style.width = `${width}px`;
  resultDiv.style.height = `${height}px`;
  // convert result div to blob and download it using html-to-image
  htmlToImage.toBlob(resultDiv).then(function (blob) {
    var file = new File([blob], 'result.jpg', {
      type: 'application/octet-stream',
    });
    window.location = URL.createObjectURL(file);
  });
};

const saveClickHandler = async () => {
  const res = await fetch('/translate/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      annotations: Array.from(
        document.querySelector('.annotationsContainer').childNodes
      ).map((annotation) => ({
        translated: annotation.innerText.replace('<br>', '\n'),
        x: annotation.style.left.replace('px', ''),
        y: annotation.style.top.replace('px', ''),
        fontSize: annotation.style.fontSize.replace('px', ''),
      })),
      binaryImage: document.getElementById('image').src.split(',')[1],
      targetLang: document.getElementById('target-lang').innerText,
    }),
  });
  const data = await res.json();
  if (data.success) {
    alert('Saved successfully');
    return;
  }
  alert(data.error);
};
