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

class Card {
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

class CardList {
  constructor(container, cardsArray) {
    this.container = container;
    this.cards = cardsArray;    
    this.render();    
  }

  addCard(cardsItem) {       
    const { cardElement } = new Card(cardsItem);       
    this.container.appendChild(cardElement);    
  }

  render() {       
    this.cards.forEach((item) => this.addCard(item))
  }
}

class Popup {  
  constructor(popup) {     
    this.popupElement = popup;
    this.open();
    this.popupElement
      .querySelector('.popup__close')
      .addEventListener('click', this.close);      
  }

  open() {    
    const submitButton = document.querySelector('.popup__button');

    clearFormFromPreviousErrorMessages();

    this.popupElement.classList.add('popup_is-opened');     

    submitButton.classList.add('popup__button_edit_disabled');
    submitButton.setAttribute('disabled', true);      
  }

  close(event) {    
    form.reset();    
    event.target.parentElement.parentElement.classList.remove('popup_is-opened');    
  }
}

class PopupEdit extends Popup {
  open() {
    const form = document.querySelector('.popup__form_edit');
    const submitButton = document.querySelector('.popup__button_edit');
    const name = document.querySelector('.user-info__name');
    const job = document.querySelector('.user-info__job');
        
    clearFormFromPreviousErrorMessages();
    
    this.popupElement.classList.add('popup_is-opened');      

    form.elements.name.value = name.textContent;
    form.elements.about.value = job.textContent;  
    
    submitButton.removeAttribute('disabled', false);
    submitButton.classList.remove('popup__button_edit_disabled');
  }
}

class PopupPicture extends Popup {
  open() {    
    this.popupElement.classList.add('popup_is-opened');
    
    const picture = this.popupElement.querySelector('.popup__picture-full');    
    picture.src = event.target.style.backgroundImage.slice(5, -2);    
  }
}

class Api {
  constructor(options) {   
    this.options = options;    
    //this.getUserInfo();  
    //this.getInitialCards();    
  } 

  getInitialCards() { 
    return fetch(`${this.options.baseUrl}/cards`, {
      method: 'GET',
      headers: this.options.headers
    })
    .then(res => {
      if (res.ok) {
        return res.json() 
      }  
      return Promise.reject(`Ошибка: ${res.status}`);    
    })     
  }   

  getUserInfo() {
    return fetch(`${this.options.baseUrl}/users/me`, {
      method: 'GET',
      headers: this.options.headers
    })
    .then(res => {
      if (res.ok) {
        return res.json() 
      } 
      return Promise.reject(`Ошибка: ${res.status}`);     
    })     
  }

  saveUserInfo(userName, userAbout) {
    return fetch(`${this.options.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.options.headers,
      body: JSON.stringify({
        name: userName,
        about: userAbout
      })
    })  
    .then(res => res.ok)    
  } 

  saveUserCard(cardName, cardLink) {
    return fetch(`${this.options.baseUrl}/cards`, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify({
        name: cardName,
        link: cardLink
      })      
    })
    .then(res => {
      if (res.ok) {
        return res.json() 
      } 
      return Promise.reject(`Ошибка: ${res.status}`);     
    })      
  }

  deleteUserCard(cardId) {
    return fetch(`${this.options.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.options.headers
    }) 
    .then(res => res.ok)          
  }

  // другие методы работы с API
}

class UserInfo {
  constructor(infoAboutUser) {
    this.render(infoAboutUser);
    this.userID = infoAboutUser._id;    
  } 

  getUserID () {    
    return this.userID;    
  }
  
  render(infoAboutUser) {
    const userName = document.querySelector('.user-info__name');
    const userPhoto = document.querySelector('.user-info__photo');
    const userAbout = document.querySelector('.user-info__job');

    userName.textContent = infoAboutUser.name;
    userAbout.textContent = infoAboutUser.about;    
    userPhoto.style.backgroundImage = `url(${infoAboutUser.avatar})`
  }
}

const form = document.forms.new;
const placesList = document.querySelector('.places-list');
const root = document.querySelector('.root');
const popup = document.querySelector('.popup-container');
const popupPlace = document.querySelector('.popup_place');
const popupEdit = document.querySelector('.popup_edit');
const popupPicture = document.querySelector('.popup_picture');
const popupBtn = document.querySelector('.user-info__button');
const placeCardLike = document.querySelector('.place-card__like-icon');
const userInfo = document.querySelector('.user-info');

/* Можно лучше: вынести параметры сервера в константы и разместить в начале файла */
const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort3',
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

function renderButtons(input) {   
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

function checkInputValidity(input) {
  const errorMessage = event.target.nextElementSibling;

  errorMessages = {
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

function clearFormFromPreviousErrorMessages() {
  Array.from(document.querySelectorAll('.error-message')).forEach((item) =>  item.textContent = '');
}

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


/*
  Хорошая работа, все замечания исправлены верно, у Вас отлично получилось!

  Если у Вас будет свободное время попробуйте переписать работу с сервером
  применив async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  Знание async/await часто требуется для работы над реальными проектами
*/









/*
  Отлично, что необходимые по заданию запросы на сервер выполняются.

  Но нужно поправить, чтобы сохранение данных пользователя на странице и удаление 
  карточки происходили только после подтверждеия сервера.

  Места где можно сделать лучше:
  - вынести из класса Api всю работу со страницейц и DOM и возвращать из методом класса 
  Api промисы с данными. Классы должны проектироваться изходя из принципа Single Responsibility - принцип единственно
  ответсвтености, сейчас класс Api берет на себя слишком много

  - в методах класса Api использовать параметры сервера, которые передаются в конструктор, 
  а не хардкодить их в каждом методе

*/

