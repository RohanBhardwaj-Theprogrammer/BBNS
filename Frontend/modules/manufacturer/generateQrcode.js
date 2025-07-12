document.addEventListener("DOMContentLoaded", () => {
  const includeRetailerCheckbox = document.getElementById("includeRetailer");
  const retailerInfo = document.getElementById("retailerInfo");
  const productForm = document.getElementById("productForm");
  const qrCodeOutput = document.getElementById("qrCodeOutput");
  const qrCodeCanvas = document.getElementById("qrCodeCanvas");
  const saveQrCodeButton = document.getElementById("saveQrCode");

  // Toggle retailer information fields
  includeRetailerCheckbox.addEventListener("change", () => {
    retailerInfo.hidden = !includeRetailerCheckbox.checked;
  });

  // Handle form submission
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Gather form data
    const productName = document.getElementById("productName").value.trim();
    const productDescription = document
      .getElementById("productDescription")
      .value.trim();
    const manufacturerName = document
      .getElementById("manufacturerName")
      .value.trim();
    const manufacturerAddress = document
      .getElementById("manufacturerAddress")
      .value.trim();

    const retailerName = includeRetailerCheckbox.checked
      ? document.getElementById("retailerName").value.trim()
      : null;
    const retailerAddress = includeRetailerCheckbox.checked
      ? document.getElementById("retailerAddress").value.trim()
      : null;

    if (!productName || !productDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    const productData = {
      productName,
      productDescription,
      manufacturerName,
      manufacturerAddress,
      retailerName,
      retailerAddress,
    };

    try {
      // Generate QR Code using qrcode.js library
      const qrData = JSON.stringify(productData);
      QRCode.toCanvas(qrCodeCanvas, qrData, { width: 300 }, (error) => {
        if (error) {
          throw new Error("Failed to generate QR code.");
        }
        qrCodeOutput.hidden = false;
      });

      // Save QR Code functionality
      saveQrCodeButton.onclick = () => {
        const link = document.createElement("a");
        link.href = qrCodeCanvas.toDataURL();
        link.download = `${productName}-QRCode.png`;
        link.click();
      };
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code. Please try again.");
    }
  });
});
