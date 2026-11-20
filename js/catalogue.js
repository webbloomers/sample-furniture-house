const grid = document.getElementById('product-grid');
const filters = document.getElementById('filters');

function cardHTML(p) {
  return `
    <article class="product-card">
      <img src="${p.images[0]}" alt="${p.name}">
      <div class="card-body">
        <span class="category-tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
        <a href="product.html?slug=${p.slug}" class="btn">View details</a>
      </div>
    </article>
  `;
}

async function showProducts(category) {
  try {
    const products = category === 'all'
      ? await getAllProducts()
      : await getProductsByCategory(category);

    if (products.length === 0) {
      grid.innerHTML = '<p class="empty-message">No products in this category yet.</p>';
      return;
    }
    grid.innerHTML = products.map(cardHTML).join('');
  } catch (err) {
    grid.innerHTML = '<p class="empty-message">Could not load products.</p>';
    console.error(err);
  }
}

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  showProducts(btn.dataset.category);
});

showProducts('all');