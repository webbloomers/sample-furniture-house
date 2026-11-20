const detail = document.getElementById('product-detail');
const WHATSAPP_NUMBER = '919876543210'; // replace with the real number from Sh

async function showProduct() {
  const slug = new URLSearchParams(window.location.search).get('slug');

  try {
    const p = slug ? await getProductBySlug(slug) : null;

    if (!p) {
      detail.innerHTML = `
        <div class="not-found">
          <h1>Product not found</h1>
          <p>Sorry, we couldn't find that product.</p>
          <a href="products.html" class="btn">Back to catalogue</a>
        </div>`;
      return;
    }

    document.title = p.name + ' - Furniture House';
    const d = p.dimensions;
    const message = encodeURIComponent('Hi, I am interested in the ' + p.name);

    detail.innerHTML = `
      <div class="product-layout">
        <div class="gallery">
          <img id="main-image" class="main-image" src="${p.images[0]}" alt="${p.name}">
          <div class="thumbs">
            ${p.images.map((src, i) => `
              <img class="thumb ${i === 0 ? 'active' : ''}" src="${src}" alt="${p.name} view ${i + 1}">
            `).join('')}
          </div>
        </div>
        <div class="info">
          <span class="category-tag">${p.category}</span>
          <h1>${p.name}</h1>
          <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
          <p>${p.description}</p>
          <ul class="specs">
            <li><strong>Material:</strong> ${p.material}</li>
            <li><strong>Size:</strong> ${d.width} x ${d.depth} x ${d.height} ${d.unit} (W x D x H)</li>
          </ul>
          <a class="btn" href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
        </div>
      </div>`;

    document.querySelectorAll('.thumb').forEach(t => {
      t.addEventListener('click', () => {
        document.getElementById('main-image').src = t.src;
        document.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      });
    });
  } catch (err) {
    detail.innerHTML = '<p class="empty-message">Could not load the product.</p>';
    console.error(err);
  }
}

showProduct();