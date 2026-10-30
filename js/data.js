// js/data.js: the only place that reads data/products.json.
// K's pages call these functions instead of fetching the JSON themselves.

let productsCache = null;

// Loads the JSON once, then reuses it
async function loadProducts() {
  if (productsCache) return productsCache;
  const response = await fetch("data/products.json");
  if (!response.ok) {
    throw new Error("Could not load products.json (status " + response.status + ")");
  }
  productsCache = await response.json();
  return productsCache;
}

// All products
async function getAllProducts() {
  return loadProducts();
}

// One product by its slug, or null if there is no match
async function getProductBySlug(slug) {
  const products = await loadProducts();
  return products.find((p) => p.slug === slug) || null;
}

// Only products marked featured (for the Home page)
async function getFeaturedProducts() {
  const products = await loadProducts();
  return products.filter((p) => p.featured);
}

// Products in one category: "bed", "sofa", "dining table" or "tv cabinet"
async function getProductsByCategory(category) {
  const products = await loadProducts();
  return products.filter((p) => p.category === category);
}

// The list of categories actually in use (for the filter buttons)
async function getCategories() {
  const products = await loadProducts();
  return [...new Set(products.map((p) => p.category))];
}

// 42000 becomes "₹42,000"
function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}