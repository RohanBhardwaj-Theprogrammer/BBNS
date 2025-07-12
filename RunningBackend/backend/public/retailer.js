// document.addEventListener("DOMContentLoaded", () => {
//   const scanButton = document.getElementById("scanButton");
//   const cameraFeed = document.createElement("video");
//   cameraFeed.setAttribute("id", "cameraFeed");
//   cameraFeed.style.position = "fixed";
//   cameraFeed.style.top = "50%";
//   cameraFeed.style.left = "50%";
//   cameraFeed.style.transform = "translate(-50%, -50%)";
//   cameraFeed.style.width = "90%";
//   cameraFeed.style.height = "auto";
//   cameraFeed.style.zIndex = "1000";
//   cameraFeed.style.display = "none";
//   document.body.appendChild(cameraFeed);

//   const overlay = document.createElement("div");
//   overlay.setAttribute("id", "scannerOverlay");
//   overlay.style.position = "fixed";
//   overlay.style.top = "0";
//   overlay.style.left = "0";
//   overlay.style.width = "100%";
//   overlay.style.height = "100%";
//   overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
//   overlay.style.zIndex = "999";
//   overlay.style.display = "none";
//   overlay.style.justifyContent = "center";
//   overlay.style.alignItems = "center";
//   document.body.appendChild(overlay);

//   let videoStream;

//   // Function to show notifications
//   function showNotification(title, message, isSuccess = false) {
//     const notification = document.createElement("div");
//     notification.style.position = "fixed";
//     notification.style.top = "20px";
//     notification.style.right = "20px";
//     notification.style.backgroundColor = isSuccess ? "green" : "red";
//     notification.style.color = "white";
//     notification.style.padding = "15px";
//     notification.style.borderRadius = "5px";
//     notification.style.zIndex = "1100";
//     notification.textContent = `${title}: ${message}`;
//     document.body.appendChild(notification);

//     setTimeout(() => {
//       notification.remove();
//     }, 3000);
//   }

//   // Function to close the scanner
//   function closeScanner() {
//     if (videoStream) {
//       videoStream.getTracks().forEach((track) => track.stop());
//     }
//     cameraFeed.style.display = "none";
//     overlay.style.display = "none";
//     cameraFeed.pause();
//   }

//   // Function to start QR code scanning
//   async function startScanning() {
//     try {
//       // Show the scanner overlay
//       overlay.style.display = "flex";

//       // Access the camera
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       videoStream = stream;
//       cameraFeed.srcObject = stream;
//       cameraFeed.style.display = "block";
//       cameraFeed.play();

//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");

//       const interval = setInterval(() => {
//         canvas.width = cameraFeed.videoWidth;
//         canvas.height = cameraFeed.videoHeight;
//         context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

//         const imageData = context.getImageData(
//           0,
//           0,
//           canvas.width,
//           canvas.height
//         );
//         const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

//         if (qrCode) {
//           clearInterval(interval);
//           closeScanner();
//           sendQRCodeToServer(qrCode.data);
//         }
//       }, 500);

//       // Close scanner on double-click or overlay click
//       overlay.addEventListener("click", closeScanner);
//     } catch (error) {
//       console.error("Camera access denied:", error);
//       alert("Unable to access the camera.");
//     }
//   }

//   // Function to send the QR code data to the server
//   async function sendQRCodeToServer(data) {
//     try {
//       const response = await fetch("/api/verify-qr", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ qrCode: data }),
//       });
//       const result = await response.json();

//       // Show result in a notification
//       showNotification(
//         result.valid ? "Success" : "Error",
//         result.message || "Invalid QR Code.",
//         result.valid
//       );
//     } catch (error) {
//       console.error("Error verifying QR code:", error);
//       showNotification("Error", "Server error. Please try again.");
//     }
//   }

//   // Attach event listener to the scan button
//   scanButton.addEventListener("click", startScanning);

//   // Close scanner on window click or double-tap
//   window.addEventListener("click", (event) => {
//     if (event.detail === 2) {
//       closeScanner();
//     }
//   });

//   window.addEventListener("keydown", (event) => {
//     if (event.key === "Escape") {
//       closeScanner();
//     }
//   });
// });



//================================================================
document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scanButton");
  const scannerContainer = document.getElementById("scannerContainer");
  const cameraStream = document.getElementById("cameraStream");
  const qrCanvas = document.getElementById("qrCanvas");
  const closeScanner = document.getElementById("closeScanner");
  const scanResult = document.getElementById("scanResult");
  const resultText = document.getElementById("resultText");

  let videoStream;

  scanButton.addEventListener("click", async () => {
    scannerContainer.classList.remove("hidden");

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      cameraStream.srcObject = videoStream;

      const canvasContext = qrCanvas.getContext("2d");
      const checkQRCode = () => {
        qrCanvas.width = cameraStream.videoWidth;
        qrCanvas.height = cameraStream.videoHeight;
        canvasContext.drawImage(
          cameraStream,
          0,
          0,
          qrCanvas.width,
          qrCanvas.height
        );

        const imageData = canvasContext.getImageData(
          0,
          0,
          qrCanvas.width,
          qrCanvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          resultText.textContent = `QR Code Result: ${code.data}`;
          scanResult.classList.remove("hidden");

          // Call backend to verify the product based on QR code
          fetch("http://localhost:3000/verifyProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCode: code.data }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                resultText.textContent = `Product: ${data.product.name}, Authenticity Verified: ${data.product.authenticity_verified}`;
              } else {
                resultText.textContent = data.message;
              }
            })
            .catch((err) => {
              resultText.textContent = "Error verifying product.";
            });

          closeScannerWindow();
        } else {
          requestAnimationFrame(checkQRCode);
        }
      };

      requestAnimationFrame(checkQRCode);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  });

  const closeScannerWindow = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    scannerContainer.classList.add("hidden");
    scanResult.classList.add("hidden");
  };

  closeScanner.addEventListener("click", closeScannerWindow);
});
