export function checkInputValidity(input) {
  const errorMessage = event.target.nextElementSibling;

  let errorMessages = {
    length: 'Должно быть от 2 до 30 символов',
    noValue: 'Это обязательное поле',
    pattern: 'Здесь должна быть ссылка',
    noError: ''
  }
  
  let message = errorMessages.noError;

  if (input.validity.tooShort || input.validity.tooLong) {       
    message = errorMessages.length;
  } 

  if (input.validity.valueMissing) {    
    message = errorMessages.noValue;   
  }

  if (input.validity.patternMismatch) {    
    message = errorMessages.pattern;
  }

  errorMessage.textContent = message;
}