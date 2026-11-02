// js/custom-order.js
// Wrapped in a function so its variable names never clash with enquiry.js
// when both scripts are on the same page.
(function () {
  const FORMSPREE_URL = "https://formspree.io/f/xqppgkzw"; // same as enquiry.js

  const form = document.getElementById("custom-order-form");
  if (!form) return;

  const submitBtn = document.getElementById("co-submit");
  const statusEl = document.getElementById("co-status");
  const val = (id) => document.getElementById(id).value.trim();

  function showErrors(errors) {
    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = errors[el.dataset.errorFor] || "";
    });
  }

  function validate() {
    const errors = {};

    if (val("co-name").length < 2) errors["co-name"] = "Please enter your name.";

    const phone = val("co-phone").replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "");
    if (!/^[6-9]\d{9}$/.test(phone)) errors["co-phone"] = "Enter a valid 10-digit mobile number.";

    if (!val("co-type")) errors["co-type"] = "Please choose a furniture type.";

    if (val("co-details").length < 20) {
      errors["co-details"] = "Please describe what you need (at least 20 characters).";
    }

    showErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = type || "";
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
        setStatus("Thank you! We'll contact you about your custom order soon.", "success");
      } else {
        setStatus("Something went wrong. Please try again, or message us on WhatsApp.", "error");
      }
    } catch (err) {
      setStatus("Network problem. Please check your connection and try again.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();