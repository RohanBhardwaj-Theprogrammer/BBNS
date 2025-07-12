function showError(message) {
  alert(message);
}

function validateInput(value, type) {
  if (!value) {
    showError(`${type} is required.`);
    return false;
  }
  return true;
}
