const navbarHTML = `
  <header class="navbar">
    <a href="index.html" class="logo">Oakland Furnishing</a>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">☰</button>
    <nav>
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="products.html">Catalogue</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>
`;

const footerHTML = `
  <footer class="footer">
    <div class="footer-col">
      <h3>Oakland Furnishing</h3>
      <p>Handcrafted furniture for your home.</p>
    </div>
    <div class="footer-col">
      <h4>Links</h4>
      <a href="index.html">Home</a>
      <a href="products.html">Catalogue</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <p>email@example.com</p>
      <p>+91 98765 43210</p>
    </div>
  </footer>
`;

document.body.insertAdjacentHTML('afterbegin', navbarHTML);
document.body.insertAdjacentHTML('beforeend', footerHTML);

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});