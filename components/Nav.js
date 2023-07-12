class DefaultNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div class="container-fluid">
          <a id="home" class="navbar-brand" href="/">Image Translator</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav">
              <a id="signup" class="nav-item nav-link" href="/signup">Sign up</a>
              <a id="signin" class="nav-item nav-link" href="/signin">Sign in</a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

class SignedInNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div class="container-fluid">
          <a id="home" class="navbar-brand" href="/">Image Translator</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav">
              <a id="history" class="nav-link" href="/history">History</a>
              <a id="signout" class="nav-link" href="/">Sign out</a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

const token = localStorage.getItem('token');
if (token) {
  customElements.define('nav-component', SignedInNav);
  document.getElementById('signout').addEventListener('click', () => {
    localStorage.removeItem('token');
  });
} else {
  customElements.define('nav-component', DefaultNav);
}

// set active nav link
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.slice(1, -1);
  const navLinks = document.getElementById(path);
  if (navLinks) {
    navLinks.classList.add('active');
  }
});
