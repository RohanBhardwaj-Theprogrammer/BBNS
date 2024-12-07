// Initialize the QR code scanner
// after the scanning it will close the camera
function productScan() {
    // Success callback for QR code scan
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`Code matched = ${decodedText}`, decodedResult);
  
      // Display the QR code content on the page
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = `<p>Product QR Code Details: ${decodedText}</p>`;
      // TODO: need to add the cancel option
      // Extract product details from the decoded text and send it to the server
      sendProductDetailsToServer(decodedText);
    };
  
    // Error callback for QR code scan
    const qrCodeErrorCallback = (errorMessage) => {
      // Handle errors during scanning
      console.error(`QR Code scanning error: ${errorMessage}`);
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML =
        "<p>QR Code scanning failed. Please try again.</p>";
    };
  
    // Initialize the HTML5QRCode object
    const html5QrCode = new Html5Qrcode("reader");
  
    // Configuration for the scanner
    const config = {
      fps: 10, // Frames per second
      qrbox: 250, // The size of the scanning area
    };
  
    // Start the scanner with the front or back camera
    html5QrCode
      .start(
        { facingMode: "environment" }, // Use back camera
        config,
        qrCodeSuccessCallback, // Success callback
        qrCodeErrorCallback // Error callback
      )
      .catch((err) => {
        console.error(`Unable to start scanning, error: ${err}`);
        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML =
          "<p>Failed to start camera for QR scanning.</p>";
      });
  }
  
  // Function to send the product details to the server
  function sendProductDetailsToServer(productDetails) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/product-details", true);
    xhr.setRequestHeader("Content-Type", "application/json");
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Server response:", xhr.responseText);
        } else {
          console.error("Server error:", xhr.responseText);
        }
      }
    };
  
    // Send the product details as a JSON object
    xhr.send(JSON.stringify({ productDetails }));
  }
  
  // Event listener for the "Scan QR Code" button
  // or add a event listener to run the function productScan
  document.getElementById("productScan").addEventListener("click", productScan);
  
  /*
   this function insert the data scanned from the qr code 
   to the page. The data scanned from the qr code which will pass the data into the json format 
   create the tabel and insert the data 
   */
  function showScanResult(qrData) {
    qrData = JSON.parse(qrData);
    const resultContainer = document
      .getElementById("productDetails")
      .getElementById("QrDetails");
    let QrDetailsTable = document.createDocumentFragment();
    const table = document.createElement("table");
    QrDetailsTable.appendChild(table);
  
    for (let { tags, data } of qrData) {
      let row = document.createElement("tr");
  
      // Create a new table cell for each tag and data
      for (let i = 0; i < tags.length; i++) {
        let tagCell = document.createElement("td");
        tagCell.textContent = tags[i];
        row.appendChild(tagCell);
  
        let dataCell = document.createElement("td");
        dataCell.textContent = data[i];
        row.appendChild(dataCell);
      }
  
      // Append the row to the table fragment
      QrDetailsTable.appendChild(row);
    }
  
    // Append the table fragment to the result container
    resultContainer.appendChild(QrDetailsTable);
    resultContainer.setAttribute("hiddent", "false");
  }
  
  // Function to display product details and genuineness status
  function displayProductDetails(QrDetails) {
    // Send the data to the server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/check-product-genenity", true);
    xhr.setRequestHeader("Content-Type", "application/json");
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Server response received
          const response = JSON.parse(xhr.responseText);
          const productGenuintyDiv = document.getElementById("productGenuinty");
          const manufacturerDetailsDiv = document.getElementById(
            "manufacturerDetails"
          );
  
          // Create a table fragment for manufacturer details
          let manufacturerDetailsTable = document.createDocumentFragment();
          const table = document.createElement("table");
          manufacturerDetailsTable.appendChild(table);
  
          // Iterate over manufacturer details and create table rows
          for (let key in response.manufacturerDetails) {
            let row = document.createElement("tr");
  
            let keyCell = document.createElement("td");
            keyCell.textContent = key;
            row.appendChild(keyCell);
  
            let valueCell = document.createElement("td");
            valueCell.textContent = response.manufacturerDetails[key];
            row.appendChild(valueCell);
  
            // Append the row to the table fragment
            manufacturerDetailsTable.appendChild(row);
          }
  
          // Update product genuineness status and append manufacturer details table
          if (response.isGenuine) {
            // Product is genuine
            productGenuintyDiv.innerHTML = `<p>GENUINE</p>`;
            productGenuintyDiv.style.backgroundColor = "green";
            productGenuintyDiv.style.color = "white";
          } else {
            // Product is not genuine
            productGenuintyDiv.innerHTML = `<p>NOT ABLE TO VERIFY</p>`;
            productGenuintyDiv.style.backgroundColor = "red";
            productGenuintyDiv.style.color = "white";
          }
  
          // Append the manufacturer details table to the manufacturerDetailsDiv
          manufacturerDetailsDiv.innerHTML = "";
          manufacturerDetailsDiv.appendChild(manufacturerDetailsTable);
          manufacturerDetailsDiv.style.display = "block";
        } else {
          // Server error
          console.error("Server error:", xhr.responseText);
        }
      }
    };
  
    // Send the product details as a JSON object
    xhr.send(JSON.stringify({ QrDetails }));
    document.QrDetails; // making it global so that oter functions can use it
  }
  async function checkProductGenenity(QrDetails) {
    try {
      // Create a new XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/check-product-genenity", true);
      xhr.setRequestHeader("Content-Type", "application/json");
  
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const productGenuintyDiv = document.getElementById("productGenuinty");
          const manufacturerDetailsDiv = document.getElementById(
            "manufacturerDetails"
          );
  
          if (xhr.status === 200) {
            try {
              // Parse the server response
              const response = JSON.parse(xhr.responseText);
  
              if (response.isGenuine) {
                // Product is genuine
                productGenuintyDiv.innerHTML = `<p>GENUINE</p>`;
                productGenuintyDiv.style.backgroundColor = "green";
                productGenuintyDiv.style.color = "white";
  
                // Display manufacturer details
                manufacturerDetailsDiv.innerHTML = `<p>Manufacturer: ${response.manufacturer}</p>`;
                manufacturerDetailsDiv.style.display = "block";
              } else {
                // Product is not genuine
                productGenuintyDiv.innerHTML = `<p>NOT ABLE TO VERIFY</p>`;
                productGenuintyDiv.style.backgroundColor = "red";
                productGenuintyDiv.style.color = "white";
                manufacturerDetailsDiv.style.display = "none";
              }
            } catch (parseError) {
              console.error("Error parsing server response:", parseError);
              productGenuintyDiv.innerHTML = `<p>ERROR PARSING RESPONSE</p>`;
              productGenuintyDiv.style.backgroundColor = "orange";
              productGenuintyDiv.style.color = "black";
              manufacturerDetailsDiv.style.display = "none";
            }
          } else {
            // Handle server error
            console.error("Server error:", xhr.statusText);
            productGenuintyDiv.innerHTML = `<p>SERVER ERROR</p>`;
            productGenuintyDiv.style.backgroundColor = "orange";
            productGenuintyDiv.style.color = "black";
            manufacturerDetailsDiv.style.display = "none";
          }
        }
      };
  
      // Send the product details as a JSON object
      xhr.send(JSON.stringify({ QrDetails }));
    } catch (error) {
      console.error("Network error:", error);
      const productGenuintyDiv = document.getElementById("productGenuinty");
      productGenuintyDiv.innerHTML = `<p>NETWORK ERROR</p>`;
      productGenuintyDiv.style.backgroundColor = "orange";
      productGenuintyDiv.style.color = "black";
      const manufacturerDetailsDiv = document.getElementById(
        "manufacturerDetails"
      );
      manufacturerDetailsDiv.style.display = "none";
    }
  }
  
  document.getElementById("buybutton").addEventListener("click", () => {
    // in this function the event will be added , it will verify that the product details has been shown or not
  
    if (document.getElementById("productDetails").style.display === "none") {
      console.error("Get the Product ");
      return;
    }
    // sending the message or the event to the server
    // then the server will send the message the retailer
  
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/rate-product", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let result = JSON.parse(xhr.responseText);
          if (result.verfied === "success") {
            console.log("product purchase successfully");
            // calling the rateing function
  
            rateRetailerAndManufacturer(QrDetails);
          }
        } else {
          console.error("Server error:", xhr.responseText);
        }
      }
    };
  
    xhr.send();
  });
  
  // code for the rating for the retailer and manufacturer:
  function rateRetailerAndManufacturer(productDetails) {
    // Early exit if the retailer is "none"
    if (productDetails.retailer === "none") {
      console.error("Retailer information is not available, cannot rate.");
      return;
    }
  
    // Parse product details if it's in string format
    productDetails = JSON.parse(productDetails);
  
    // Inject CSS styles into the head of the document
    const style = document.createElement("style");
    style.innerHTML = `
      .stars {
        display: inline-block;
        cursor: pointer;
      }
      .star {
        font-size: 24px;
        color: gray; /* Default color */
        padding: 5px;
      }
      .star:hover {
        color: gold; /* Highlight the star when hovered */
      }
      #rating-section {
        margin-top: 20px;
      }
      #rating-section h3 {
        font-size: 20px;
        margin-bottom: 10px;
      }
      #submit-rating {
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
      }
      #submit-rating:hover {
        background-color: #45a049;
      }
    `;
    document.head.appendChild(style);
  
    // HTML structure for the rating system
    let ratingHTML = `
      <div id="rating-section">
        <h3>Rate the Product</h3>
        
        <!-- Retailer Rating -->
        <div id="retailer-rating">
          <label for="retailer-rating">Rate the Retailer:</label>
          <div id="retailer-stars" class="stars" data-rating="0">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
          </div>
          <input type="hidden" id="retailer-rating-value" value="0">
        </div>
        
        <!-- Manufacturer Rating -->
        <div id="manufacturer-rating">
          <label for="manufacturer-rating">Rate the Manufacturer:</label>
          <div id="manufacturer-stars" class="stars" data-rating="0">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
          </div>
          <input type="hidden" id="manufacturer-rating-value" value="0">
        </div>
        
        <!-- Submit Button -->
        <button id="submit-rating" onclick="submitRatings()">Submit Rating</button>
      </div>
    `;
  
    // Insert the rating HTML into the page (e.g., into a div with id="product-details")
    document.getElementById("product-details").innerHTML = ratingHTML;
  
    // Add event listeners for star click events
    addStarRatingEvents("retailer");
    addStarRatingEvents("manufacturer");
  
    // Function to add click events for stars
    function addStarRatingEvents(type) {
      const starElements = document.querySelectorAll(`#${type}-stars .star`);
      starElements.forEach((star) => {
        star.addEventListener("click", () => {
          const ratingValue = star.getAttribute("data-value");
          document.getElementById(`${type}-rating-value`).value = ratingValue;
  
          // Highlight the stars up to the selected rating
          const stars = document.querySelectorAll(`#${type}-stars .star`);
          stars.forEach((s, index) => {
            if (index < ratingValue) {
              s.style.color = "gold"; // Highlight the selected stars
            } else {
              s.style.color = ""; // Reset the non-selected stars
            }
          });
        });
      });
    }
  
    // Submit Ratings function
    function submitRatings() {
      const retailerRating = document.getElementById(
        "retailer-rating-value"
      ).value;
      const manufacturerRating = document.getElementById(
        "manufacturer-rating-value"
      ).value;
  
      // Check if both ratings are provided
      if (retailerRating === "0" || manufacturerRating === "0") {
        console.error("Please rate both the retailer and manufacturer!");
        return;
      }
  
      // Prepare the data to send to the server
      const ratingData = {
        productId: productDetails.id,
        retailerRating: retailerRating,
        manufacturerRating: manufacturerRating,
      };
  
      // Example of sending the data to the server (e.g., using fetch)
      fetch("/submit-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Thank you for your ratings!");
          } else {
            console.error("Failed to submit ratings. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error submitting ratings: ", error.message);
        });
    }
  }
  
  //this will make the button avaialbe and make this section hidden :
  //productscanSection , and if the user click it then it will optn the
  // this productscanSection again and remove the productDetails sections
  // if the user cancel the productscan , it will then show the previos data
  // this function will only be active after the product is scanned once , not before that
  function showStaticQrScaOption() {
    const qrCodeSection = document.getElementById("staticQrScan");
    document.getElementById("productscanSection").hidden = true;
    qrCodeSection.hidden = false;
    // this will contains the code for making it visible to the top after the menus bar
    // add the associate functionality of it
    qrCodeSection.style = `
    position: fixed; /* Fixes the element in place */
    top: 0; /* Positions the element at the top of the viewport */
    left: 0; /* Aligns the element to the left of the viewport */
    width: 100%; /* Makes the element span the full width of the viewport */
    background-color: #f9f9f9; /* Light gray background for a clean look */
    border-bottom: 1px solid #ddd; /* Subtle border at the bottom for definition */
    padding: 10px 20px; /* Adds space inside the element */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adds a slight shadow for depth */
    font-family: Arial, sans-serif; /* Sets a clean, readable font */
    color: #333; /* Dark text for readability */
    z-index: 1000; /* Ensures the element is above other content */
  `;
  
    qrCodeSection.addEventListener("click", () => {
      qrCodeSection.hidden = true;
      document.getElementById("productscanSection").hidden = false;
      // this will contain the code for making it visible to the top after the menus bar
      // add the associate functionality of it
      document.getElementById("productDetails").hidden = true;
      productScan();
    });
  }