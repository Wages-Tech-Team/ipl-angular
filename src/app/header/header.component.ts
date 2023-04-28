import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  footerSocialsAssets = {
    linkedIn: {
      src: './../../assets/header/linkedIn-icon.svg'
    },
  }

  constructor() { }

  ngOnInit(): void {
  }

}
