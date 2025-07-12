document.addEventListener("DOMContentLoaded", () => {
    // Get elements for Manufacturer, Retailer, and Buyer sections
    const manufacturerSection = document.querySelector('.icon img[alt="Manufacturer"]');
    const retailerSection = document.querySelector('.icon img[alt="Retailer"]');
    const buyerSection = document.querySelector('.icon img[alt="Buyer"]');
    const loginSection=document.querySelector('.login img[alt="Login"]');
    // Add event listeners for redirection
    if (manufacturerSection) {
      manufacturerSection.addEventListener("click", () => {
        window.location.href = "manufacturer.html"; // Redirect to Manufacturer Portal
      });
    }
  
    if (retailerSection) {
      retailerSection.addEventListener("click", () => {
        window.location.href = "retailer.html"; // Redirect to Retailer Portal
      });
    }
  
    if (buyerSection) {
      buyerSection.addEventListener("click", () => {
        window.location.href = "default.html"; // Redirect to Buyer Portal
      });


    }


    if (loginSection){
        loginSection.addEventListener("click",()=>{
            window.location.href="login.html";
        });
    }
  });
  