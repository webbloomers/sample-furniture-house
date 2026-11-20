async function showProducts() {
  const grid = document.getElementById('product-grid');
  try {
    const products = await getAllProducts();
    grid.innerHTML = products.map(p => `
      <article class="product-card">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="card-body">
          <span class="category-tag">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
          <a href="product.html?slug=${p.slug}" class="btn">View details</a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p>Could not load products.</p>';
    console.error(err);
  }
}
showProducts();