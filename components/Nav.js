class Nav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav class="nav justify-content-center">
        <a class="nav-link" href="/">Image Translator</a>
        <a class="nav-link" href="/signup">Sign up</a>
        <a class="nav-link" href="/signin">Sign in</a>
      </nav>
    `;
  }
}

customElements.define('nav-component', Nav);
