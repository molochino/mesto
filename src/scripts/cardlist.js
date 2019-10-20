import {Card} from './script.js'

export class CardList {
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