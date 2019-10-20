export function renderButtons(input) {   
  const form = input.parentElement;   
  const submitButton = form.elements.button;
  
  const isValid = Array.from(form.elements).every((item) => item.validity.valid);
  
  if (!isValid) {
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('popup__button_edit_disabled');
  } else {
    submitButton.removeAttribute('disabled', false);
    submitButton.classList.remove('popup__button_edit_disabled');
  }  
}