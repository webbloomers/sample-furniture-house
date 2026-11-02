// js/enquiry.js
const FORMSPREE_URL = "https://formspree.io/f/xqppgkzw";
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

const form = document.getElementById("enquiry-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");
const productSelect = document.getElementById("product");
const whatsappBtn = document.getElementById("whatsapp-btn");

const val = (id) => document.getElementById(id).value.trim();

function showErrors(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = errors[el.dataset.errorFor] || "";
  });
}

function validate() {
  const errors = {};

  if (val("name").length < 2) errors.name = "Please enter your name.";

  // Accepts 9876543210, +91 98765 43210, 098765-43210 and similar
  const phone = val("phone").replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "");
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit mobile number.";

  if (!val("product")) errors.product = "Please choose a product.";
  if (val("message").length < 10) errors.message = "Please write at least 10 characters.";

  showErrors(errors);
  return Object.keys(errors).length === 0;
}

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = type || "";
}

function updateWhatsApp() {
  const product = val("product");
  const text = product
    ? `Hi Oakline Furnishing, I'm interested in the ${product}.`
    : "Hi Oakline Furnishing, I'd like to know more about your furniture.";
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

async function fillProducts() {
  try {
    const products = await getAllProducts();
    products.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      productSelect.appendChild(option);
    });

    // product.html can link here with ?product=<slug> to preselect the product
    const slug = new URLSearchParams(window.location.search).get("product");
    const match = products.find((p) => p.slug === slug);
    if (match) productSelect.value = match.name;
  } catch (err) {
    setStatus("Could not load the product list. Please refresh.", "error");
  }
  updateWhatsApp();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  submitBtn.disabled = true;
  setStatus("Sending...");

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.reset();
      showErrors({});
      updateWhatsApp();
      setStatus("Thank you! We'll get back to you soon.", "success");
    } else {
      setStatus("Something went wrong. Please try again, or message us on WhatsApp.", "error");
    }
  } catch (err) {
    setStatus("Network problem. Please check your connection and try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

productSelect.addEventListener("change", updateWhatsApp);
fillProducts();