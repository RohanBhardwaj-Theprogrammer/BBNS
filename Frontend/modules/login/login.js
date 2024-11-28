"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const authBtn = document.getElementById("auth-btn");
  const toggleBtn = document.getElementById("toggle-btn");
  const toggleText = document.getElementById("toggle-text");
  const categorySpecificFields = document.getElementById(
    "category-specific-fields"
  );
  const category = document.getElementById("category");
  const loginFields = document.getElementById("login-fields");
  const signupFields = document.getElementById("signup-fields");

  let isSignup = false;

  // Toggle between Login and Signup
  toggleBtn.addEventListener("click", () => {
    isSignup = !isSignup;
    authBtn.textContent = isSignup ? "Signup" : "Login";
    toggleText.textContent = isSignup
      ? "Already have an account?"
      : "Don't have an account?";
    toggleBtn.textContent = isSignup ? "Login" : "Signup";
    loginFields.style.display = isSignup ? "none" : "block";
    signupFields.style.display = isSignup ? "block" : "none";
    categorySpecificFields.innerHTML = ""; // Reset additional fields
    category.value = ""; // Clear selected category
  });

  // Update additional fields based on category
  category.addEventListener("change", () => {
    const selectedCategory = category.value;
    categorySpecificFields.innerHTML = ""; // Clear previously displayed fields

    if (selectedCategory === "retailer") {
      categorySpecificFields.innerHTML = `
        <div class="form-group">
          <label for="shop-name">Shop Name</label>
          <input type="text" id="shop-name" name="shop-name" placeholder="Enter your shop name" required>
        </div>
        <div class="form-group">
          <label for="shop-address">Shop Address</label>
          <input type="text" id="shop-address" name="shop-address" placeholder="Enter your shop address" required>
        </div>
      `;
    } else if (selectedCategory === "manufacturer") {
      categorySpecificFields.innerHTML = `
        <div class="form-group">
          <label for="company-name">Company Name</label>
          <input type="text" id="company-name" name="company-name" placeholder="Enter your company name" required>
        </div>
        <div class="form-group">
          <label for="plant-name">Manufacturing Plant Name</label>
          <input type="text" id="plant-name" name="plant-name" placeholder="Enter your manufacturing plant name" required>
        </div>
        <div class="form-group">
          <label for="goods">Types of Goods Produced</label>
          <select id="goods" name="goods" multiple required>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="toys">Toys</option>
            <option value="beauty">Beauty Products</option>
          </select>
        </div>
      `;
    }
  });

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = { type: isSignup ? "signup" : "login" };

    formData.forEach((value, key) => {
      if (key !== "category") {
        data[key] = value.trim();
      }
    });

    // Handle Manufacturer Goods Selection
    if (category.value === "manufacturer") {
      const selectedGoods = [
        ...document.getElementById("goods").selectedOptions,
      ].map((option) => option.value);
      data["goods"] = selectedGoods;
    }

    // Log data (testing function)
    console.log("Form Data:", JSON.stringify(data));

    // Simulate sending data to server
    sendDataToServer(data);
  });

  // Simulate sending data to the server
  function sendDataToServer(data) {
    console.log("Sending Data to Server:", JSON.stringify(data));
    // Simulate server request (use your actual server here)
    alert("Data has been sent to the server!");
  }
});
