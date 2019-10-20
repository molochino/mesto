export class UserInfo {
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