// identify an element to observe
const body = document.querySelector('body');

// observe body for childList changes and add listeners if #result is added
const observer = new MutationObserver(() => {
  if (document.getElementById('result') === null) return;
  const switchContainer = document.getElementById('switch-container');
  const showAnnotationsSwitch = document.getElementById('show-annotations');
  const annotationsContainer = document.getElementById('annotationsContainer');

  // Hide switch if no annotations
  if (
    document.getElementById('annotationsContainer') === null &&
    switchContainer
  ) {
    switchContainer.style.display = 'none';
  }

  // Show or hide annotations
  showAnnotationsSwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
      annotationsContainer.classList.remove('hidden');
    } else {
      annotationsContainer.classList.add('hidden');
    }
  });
});

observer.observe(elementToObserve, { childList: true });
