const featuredGrid = document.getElementById('featured-grid');

async function showFeatured() {
  try {
    const products = await getFeaturedProducts();
    if (products.length === 0) {
      featuredGrid.innerHTML = '<p class="empty-message">No featured products yet.</p>';
      return;
    }
    featuredGrid.innerHTML = products.map(p => `
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
    featuredGrid.innerHTML = '<p class="empty-message">Could not load products.</p>';
    console.error(err);
  }
}

showFeatured();