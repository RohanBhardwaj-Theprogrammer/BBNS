document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  sidebar.innerHTML = `
    <a href="./modules/default/default.html">Home</a>
    <a href="./modules/retailer/retailer.html">Retailer</a>
    <a href="./modules/manufacturer/manufacturer.html">Manufacturer</a>
  `;

  document.body.insertBefore(sidebar, document.body.firstChild);
});
