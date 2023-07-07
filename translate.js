// observe for body changes
const body = document.querySelector('body');

// observe body for childList changes and add listeners if #result is added
const observer = new MutationObserver(() => {
  const annotationsContainer = document.querySelector('.annotationsContainer');
  if (!document.getElementById('result') || !annotationsContainer) return;

  const showAnnotationsSwitch = document.getElementById('show-annotations');
  const downloadButton = document.getElementById('download-btn');

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
});

observer.observe(body, { childList: true });

const toggleAnnotations = async (annotationsContainer, checked) => {
  annotationsContainer.style.display = checked ? 'block' : 'none';
};

const annotationClickHandler = (annotation) => {
  annotation.style.opacity = annotation.style.opacity === '0' ? '1' : '0';
};

const downloadClickHandler = () => {
  const resultDiv = document.getElementById('result');
  // convert result div to blob and download it using html-to-image
  htmlToImage.toBlob(resultDiv).then(function (blob) {
    var file = new File([blob], 'result.jpg', {
      type: 'application/octet-stream',
    });
    window.location = URL.createObjectURL(file);
    URL.revokeObjectURL(url) // free memory
  });
};
