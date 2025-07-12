document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <div>Know Your Product Geninuiness</div>
    <div>
      <a href="/modules/default/default.html">Home</a>
      <a href="/modules/retailer/retailer.html">Retailer</a>
      <a href="/modules/manufacturer/manufacturer.html">Manufacturer</a>
      <button onclick="logout()">Logout</button>
    </div>
  `;

  document.body.insertBefore(navbar, document.body.firstChild);
});
