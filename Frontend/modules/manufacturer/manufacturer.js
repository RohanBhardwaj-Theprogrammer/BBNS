document.addEventListener("DOMContentLoaded", () => {
  // Authentication Check
  if (sessionStorage.getItem("authToken")) {
    window.location.href = "/login.html"; // Redirect to login if not authenticated
  }

  const form = document.getElementById("product-form");
  const qrCodeResult = document.getElementById("qr-code-result");

  // Handle QR code generation
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productPhoto = document.getElementById("product-photo").files[0];

    if (!productName || !productPhoto) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPhoto", productPhoto);

    try {
      // Show loading spinner
      showLoading();

      const response = await fetch("/api/manufacturers/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        qrCodeResult.innerHTML = `
          <p>QR Code Generated:</p>
          <img src="${data.qrCodeURL}" alt="QR Code" />
        `;
      } else {
        alert("Failed to create QR code. Please try again.");
      }
    } catch (error) {
      alert("Error uploading product details.");
    } finally {
      // Hide loading spinner
      hideLoading();
    }
  });

  // Redirect to QR Code generation page
  document.getElementById("goToQrPage").addEventListener("click", () => {
    window.location.href = "/generateQrcode.html"; // Redirect to QR code generation page
  });

  // Fetch and display scan history
  async function getScanHistory() {
    try {
      const response = await fetch("/api/manufacturer/scan-history", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const historyList = document.getElementById("scan-history");
        data.history.forEach((scan) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Product: ${scan.productName}, Date: ${scan.date}`;
          historyList.appendChild(listItem);
        });
      }
    } catch (error) {
      console.error("Error fetching scan history:", error);
    }
  }

  // Fetch and display product sales
  async function getProductSales() {
    try {
      const response = await fetch("/api/manufacturer/sales", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        document.getElementById(
          "sales-count"
        ).textContent = `Total Products Sold: ${data.salesCount}`;
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  }

  // Fetch and populate scan history and sales data
  getScanHistory();
  getProductSales();

  // Handle profile update
  document
    .getElementById("profile-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const manufacturerName =
        document.getElementById("manufacturer-name").value;
      const manufacturerContact = document.getElementById(
        "manufacturer-contact"
      ).value;

      try {
        const response = await fetch("/api/manufacturer/profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ manufacturerName, manufacturerContact }),
        });

        if (response.ok) {
          alert("Profile updated successfully!");
        } else {
          alert("Failed to update profile.");
        }
      } catch (error) {
        alert("Error updating profile.");
      }
    });

  // Show loading spinner
  function showLoading() {
    document.getElementById("loading").classList.remove("hidden");
  }

  // Hide loading spinner
  function hideLoading() {
    document.getElementById("loading").classList.add("hidden");
  }
});
