class DefaultNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav class="nav justify-content-center">
        <a id="home" class="nav-link" href="/">Image Translator</a>
        <a id="signup" class="nav-link" href="/signup">Sign up</a>
        <a id="signin" class="nav-link" href="/signin">Sign in</a>
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
      <nav class="nav justify-content-center">
        <a id="home" class="nav-link" href="/">Image Translator</a>
        <a id="history" class="nav-link" href="/history">History</a>
        <a id="signout" class="nav-link" href="/">Sign out</a>
      </nav>
    `;
  }
}

const token = localStorage.getItem('token');
if (token) {
  customElements.define('nav-component', SignedInNav);
  document.getElementById('signout').addEventListener('click', () => {
    console.log('signout');
    localStorage.removeItem('token');
  });
} else {
  customElements.define('nav-component', DefaultNav);
}
