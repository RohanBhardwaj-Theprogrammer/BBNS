
function showNotification(heading, body) {
  // Create the dialog element
  const dialog = document.createElement("dialog");

  // Basic styling for the dialog box
  dialog.style.width = "80%";
  dialog.style.maxWidth = "500px";
  dialog.style.padding = "20px";
  dialog.style.border = "none";
  dialog.style.borderRadius = "10px";
  dialog.style.backgroundColor = "#ffffff";
  dialog.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.1)";
  dialog.style.position = "fixed";
  dialog.style.top = "20px"; // Positioned at the top for a notification
  dialog.style.left = "50%";
  dialog.style.transform = "translateX(-50%)";
  dialog.style.zIndex = "1000";
  dialog.style.opacity = "0";
  dialog.style.transition = "opacity 0.3s ease-in-out"; // Smooth fade-in effect
  dialog.style.display = "block"; // Initially block for the transition to work

  // Create and style the content container for the dialog box
  const contentContainer = document.createElement("div");
  contentContainer.style.fontFamily = "Arial, sans-serif";
  contentContainer.style.color = "#333";
  contentContainer.style.textAlign = "center";

  // Check if the heading contains 'Error' or ends with '!!' and change the color accordingly
  const headingColor =
    heading.includes("Error") || heading.endsWith("!!") ? "#f44336" : "#4CAF50"; // Red for errors, green for success

  // Add heading and body content to the container
  contentContainer.innerHTML = `
    <h2 style="font-size: 22px; margin-bottom: 10px; color: ${headingColor};">${heading}</h2>
    <p style="font-size: 16px; color: #555;">${body}</p>
  `;

  // Append content to the dialog
  dialog.appendChild(contentContainer);

  // Create the close button (×) and position it at the top-right corner
  const closeButton = document.createElement("div");
  closeButton.textContent = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "24px";
  closeButton.style.color = "#888";
  closeButton.style.cursor = "pointer";
  closeButton.style.transition = "color 0.2s";

  // Show the close button on hover
  dialog.addEventListener("mouseenter", () => {
    closeButton.style.color = "#f44336"; // Red color when hovering over the notification
  });

  dialog.addEventListener("mouseleave", () => {
    closeButton.style.color = "#888"; // Default color when not hovering
  });

  // Close the dialog when the close button (×) is clicked
  closeButton.addEventListener("click", () => {
    dialog.style.opacity = "0"; // Fade out the dialog
    setTimeout(() => {
      dialog.close();
      dialog.remove(); // Remove from DOM after the fade-out transition
    }, 300); // Wait for the fade-out to complete before removing the dialog
  });

  // Append the close button to the dialog
  dialog.appendChild(closeButton);

  // Append the dialog to the body
  document.body.appendChild(dialog);

  // Show the dialog with a fade-in effect
  setTimeout(() => {
    dialog.style.opacity = "1"; // Fade in the dialog
  }, 10);

  // Add swipe-to-close functionality
  let startX;
  let endX;
  dialog.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX; // Store the initial touch position
  });

  dialog.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX; // Get the final touch position
    if (Math.abs(startX - endX) > 100) {
      // If swipe distance is greater than 100px
      dialog.style.opacity = "0"; // Fade out the dialog
      setTimeout(() => {
        dialog.close();
        dialog.remove(); // Remove from DOM after the fade-out transition
      }, 300); // Wait for the fade-out to complete before removing the dialog
    }
  });

  // Automatically close the notification after 10 seconds
  setTimeout(() => {
    dialog.style.opacity = "0"; // Fade out the dialog
    setTimeout(() => {
      dialog.close();
      dialog.remove(); // Remove from DOM after the fade-out transition
    }, 300);
  }, 10000); // Close the notification after 10 seconds
}
