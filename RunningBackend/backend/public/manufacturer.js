document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const qrCodeResult = document.getElementById("qr-code-result");
  const loadingSpinner = document.getElementById("loading");

  // Add event listener for form submission
  productForm.addEventListener("submit", async (event) => {
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

    // Create FormData to send to backend
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPhoto", productPhoto);
    formData.append("productPrice", productPrice);
    formData.append("productDescription", productDescription);

    try {
      // Attempt to send data to backend
      const response = await fetch("http://localhost:3000/api/manufacturer/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Clear previous QR code
        qrCodeResult.innerHTML = "";

        // Display QR code from backend
        const qrImage = document.createElement("img");
        qrImage.src = data.qrCodeUrl; // Assuming backend returns a QR code URL
        qrCodeResult.appendChild(qrImage);

        alert("Product submitted successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting product:", error);

      // Fallback: Local simulation if backend fails
      setTimeout(() => {
        loadingSpinner.classList.add("hidden");
        qrCodeResult.innerHTML = `
          <h4>QR Code Generated Successfully (Simulation)!</h4>
          <p><strong>Product Name:</strong> ${productName}</p>
          <p><strong>Category:</strong> ${productCategory}</p>
          <p><strong>Price:</strong> $${productPrice}</p>
          <p><strong>Description:</strong> ${productDescription}</p>
          <p><strong>Image:</strong></p>
          <img src="${URL.createObjectURL(productPhoto)}" alt="${productName}" height="100" />
        `;

        // Generate QR Code locally
        const productInfo = {
          productName,
          productCategory,
          productPrice,
          productDescription,
        };

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

      alert("Backend unavailable. Simulated QR code generated.");
    } finally {
      // Hide loading spinner
      loadingSpinner.classList.add("hidden");
    }
  });
});
