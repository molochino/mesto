function clearFormFromPreviousErrorMessages() {
  Array.from(document.querySelectorAll('.error-message')).forEach((item) =>  item.textContent = '');
}

export {clearFormFromPreviousErrorMessages as clearForm}