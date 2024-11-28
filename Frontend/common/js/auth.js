function isAuthenticated() {
  return localStorage.getItem("token") ? true : false;
}

function logout() {
  localStorage.removeItem("token");
  location.href = "/modules/login/login.html";
}
