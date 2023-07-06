// observe for body changes
const body = document.querySelector('body');

// observe body for childList changes and add listeners if #result is added
const observer = new MutationObserver(() => {
  const annotationsContainer = document.getElementById('annotationsContainer');
  if (document.getElementById('result') === null || !annotationsContainer)
    return;

  const switchContainer = document.getElementById('switch-container');
  const showAnnotationsSwitch = document.getElementById('show-annotations');

  // Display switch container
  switchContainer.style.display = 'block';

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
});

observer.observe(elementToObserve, { childList: true });

const toggleAnnotations = async (annotationsContainer, checked) => {
  annotationsContainer.style.display = checked ? 'block' : 'none';
};

const annotationClickHandler = (annotation) => {
  annotation.style.opacity = annotation.style.opacity === '0' ? '1' : '0';
};
