// const initialCards = [
//     {
//       name: 'Архыз',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
//     },
//     {
//       name: 'Челябинская область',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
//     },
//     {
//       name: 'Иваново',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
//     },
//     {
//       name: 'Камчатка',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
//     },
//     {
//       name: 'Холмогорский район',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
//     },
//     {
//       name: 'Байкал',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
//     },
//     {
//       name: 'Нургуш',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg'
//     },
//     {
//       name: 'Тулиновка',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg'
//     },
//     {
//       name: 'Остров Желтухина',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg'
//     },
//     {
//       name: 'Владивосток',
//       link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg'
//      }
//   ];

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3' : 'https://praktikum.tk/cohort3'

import {CardList} from './cardlist.js';
import {Popup, PopupEdit, PopupPicture} from './popups.js';
import {Api} from './api.js';
import {UserInfo} from './userinfo.js';
import {renderButtons} from './renderbuttons.js';
import {checkInputValidity} from './check_input_validity.js';

export class Card {
  constructor(cardsItem) {   
    this.cardsItem = cardsItem; 
    this.cardElement = this.create(cardsItem);     
    this.cardElement
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.like);    
  }

  createElement (type, userClasses) {
    const el = document.createElement(type);
    el.classList.add(userClasses);
    return el;
  }

  create(cardsItem) {
    const placeCard = this.createElement('div', 'place-card');
    
    const placeCardImg = this.createElement('div', 'place-card__image');
    placeCardImg.style.backgroundImage = `url(${cardsItem.link})`;      
    
    const placeCardDltBtn = this.createElement('button', 'place-card__delete-icon');
    
    const placeCardDscr = this.createElement('div', 'place-card__description');
    
    const placeCardName = this.createElement('h3', 'place-card__name')
    placeCardName.textContent = cardsItem.name;

    const placeCardLikeBtn = this.createElement('button', 'place-card__like-icon')
    
    if (this.cardsItem.owner._id == user.getUserID()) {
      this.remove = this.remove.bind(this);
      placeCardDltBtn.addEventListener('click', this.remove)
      placeCardImg.appendChild(placeCardDltBtn);      
    }
    
    placeCardDscr.appendChild(placeCardName);
    placeCardDscr.appendChild(placeCardLikeBtn);
    placeCard.appendChild(placeCardImg);
    placeCard.appendChild(placeCardDscr);    

    return placeCard;
  }

  like(event) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }

  remove(event) { 
    let isConfirmed = confirm('Вы действительно хотите удалить карточку?');
    if (isConfirmed) {      
      api.deleteUserCard(this.cardsItem._id)         
        .then(status => {          
          if (status) {
            this.cardElement.parentNode.removeChild(this.cardElement);      
          } else {
            alert('Ошибка, карточка не была удалена')
          }
        })      
        .catch((err) => {
          alert(`Ой, возникла ошибка ${err}`)
        })      
    }      
  }
}

//const form = document.forms.new;
const placesList = document.querySelector('.places-list');
const root = document.querySelector('.root');
const popup = document.querySelector('.popup-container');
const popupPlace = document.querySelector('.popup_place');
const popupEdit = document.querySelector('.popup_edit');
const popupPicture = document.querySelector('.popup_picture');
const popupBtn = document.querySelector('.user-info__button');
const placeCardLike = document.querySelector('.place-card__like-icon');
const userInfo = document.querySelector('.user-info');

const api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: '784c0031-842a-4b9d-9d30-2f4248ee3c85',
    'Content-Type': 'application/json'
  }
});
let list;
let user;
api.getInitialCards()
  .then((result) => {
    list = new CardList (document.querySelector('.places-list'), result)      
  })
  .catch((err) => {
    alert(`Ой, возникла ошибка ${err}`)
  })  

api.getUserInfo()
  .then((result) => {     
    user = new UserInfo(result);      
  })  
  .catch((err) => {
    alert(`Ой, возникла ошибка ${err}`)
  })  

popup.addEventListener('submit', function(event) {
  event.preventDefault();   

  if (event.target.classList.contains('popup__form_place')) {    
    const form = document.querySelector('.popup__form_place');           

    api.saveUserCard(form.elements.name.value, form.elements.link.value)
      .then((data) => {          
        list.addCard(data);
        form.reset();
        popupPlace.classList.remove('popup_is-opened');  
      }) 
      .catch((err) => {
        alert(`Ой, возникла ошибка ${err}`)
      })             
  }

  if (event.target.classList.contains('popup__form_edit')) {   
    const form = document.querySelector('.popup__form_edit');    
    const name = document.querySelector('.user-info__name');
    const job = document.querySelector('.user-info__job');    

    api.saveUserInfo(form.elements.name.value, form.elements.about.value)
      .then(status => {
        if (status) {
          name.textContent = form.elements.name.value;
          job.textContent = form.elements.about.value; 
          popupEdit.classList.remove('popup_is-opened');    
        } else {
          alert('Ошибка, данные не удалось сохранить')
        }
      })
      .catch((err) => {
        alert(`Ой, возникла ошибка ${err}`)
      })       
  }    
});

popup.addEventListener('input', function(event) {  
  checkInputValidity(event.target);
  renderButtons(event.target);
});

userInfo.addEventListener('click', function(event) {
  if (event.target.classList.contains('user-info__button')) { 
    new Popup(document.querySelector('.popup_place'));
  };

  if (event.target.classList.contains('user-info__button_edit')) {  
    new PopupEdit(document.querySelector('.popup_edit'));
  };  
});

placesList.addEventListener('click', function(event) {
  if (event.target.classList.contains('place-card__image')) {    
    new PopupPicture(document.querySelector('.popup_picture'))
  }
});