export class Api {
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