import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerSocialsAssets = {
    linkedIn: {
      src: './assets/header/linkedIn-icon.svg'
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  
  checkScreen = () => {
    let url = window.location.href+"";
    if(url.includes('login-registration'))
    return false;

    return true;
  }

}
