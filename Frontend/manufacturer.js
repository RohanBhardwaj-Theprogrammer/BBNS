document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const generateBtn = document.getElementById("generate-btn");
  const qrCodeResult = document.getElementById("qr-code-result");
  const loadingSpinner = document.getElementById("loading");

  // Add event listener for form submission
  productForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");

    // Collect form data
    const productName = document.getElementById("product-name").value;
    const productCategory = document.getElementById("product-category").value;
    const productPhoto = document.getElementById("product-photo").files[0];
    const productPrice = document.getElementById("product-price").value;
    const productDescription = document.getElementById("product-description").value;

    // Validation check
    if (!productName || !productCategory || !productPrice || !productDescription || !productPhoto) {
      alert("Please fill in all fields and upload an image.");
      loadingSpinner.classList.add("hidden");
      return;
    }

    // Simulate QR code generation (replace this with actual backend integration)
    setTimeout(() => {
      loadingSpinner.classList.add("hidden");
      qrCodeResult.innerHTML = `
        <h4>QR Code Generated Successfully!</h4>
        <p><strong>Product Name:</strong> ${productName}</p>
        <p><strong>Category:</strong> ${productCategory}</p>
        <p><strong>Price:</strong> $${productPrice}</p>
        <p><strong>Description:</strong> ${productDescription}</p>
        <p><strong>Image:</strong></p>
        <img src="${URL.createObjectURL(productPhoto)}" alt="${productName}" height="100" />
      `;

      // Generate QR Code
      const productInfo = {
        productName,
        productCategory,
        productPrice,
        productDescription,
      };

      // Clear previous QR code and generate a new one
      qrCodeResult.innerHTML += `<div id="qr-code"></div>`;
      const qrCode = new QRCode(document.getElementById("qr-code"), {
        text: JSON.stringify(productInfo), // Encode product info as JSON
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
      });
    }, 2000);
  });
});
