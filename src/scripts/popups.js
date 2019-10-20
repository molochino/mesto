import {clearForm} from './clearfrompreviousmessages.js';
//import {form} from './script.js';
export const form = document.forms.new;

export class Popup {  
  constructor(popup) {     
    this.popupElement = popup;
    this.open();
    this.popupElement
      .querySelector('.popup__close')
      .addEventListener('click', this.close);      
  }

  open() {    
    const submitButton = document.querySelector('.popup__button');

    clearForm();

    this.popupElement.classList.add('popup_is-opened');     

    submitButton.classList.add('popup__button_edit_disabled');
    submitButton.setAttribute('disabled', true);      
  }

  close(event) {    
    form.reset();    
    event.target.parentElement.parentElement.classList.remove('popup_is-opened');    
  }
}

export class PopupEdit extends Popup {
  open() {
    const form = document.querySelector('.popup__form_edit');
    const submitButton = document.querySelector('.popup__button_edit');
    const name = document.querySelector('.user-info__name');
    const job = document.querySelector('.user-info__job');
        
    clearForm();
    
    this.popupElement.classList.add('popup_is-opened');      

    form.elements.name.value = name.textContent;
    form.elements.about.value = job.textContent;  
    
    submitButton.removeAttribute('disabled', false);
    submitButton.classList.remove('popup__button_edit_disabled');
  }
}

export class PopupPicture extends Popup {
  open() {    
    this.popupElement.classList.add('popup_is-opened');
    
    const picture = this.popupElement.querySelector('.popup__picture-full');    
    picture.src = event.target.style.backgroundImage.slice(5, -2);    
  }
}