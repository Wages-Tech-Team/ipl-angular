import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FrozenColumn } from 'primeng/table';
import { CommonService } from './common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  projectDetails: any;
  blockDetails: any;
  showoptions: boolean = true;
  toggleNav: boolean = false;
  projectForm: FormGroup;
  submitted: boolean = false;
  constructor(private router: Router, public service: CommonService) {
    this.projectForm = new FormGroup({
      "project_name": new FormControl('PS', Validators.required),
      "block_name": new FormControl('PS', Validators.required)
    })
  }

  ngOnInit(): void {
    this.checkCurrentScreen();
    // this.getProjectData();
  }

  selectedDetails = (event: any) => {
    event = event.target.value;
    for (let data of this.blockDetails) {
      if (event == data.id) {
        sessionStorage.setItem('project_id', data.project_id);
        sessionStorage.setItem('block_id', data.id);
      }
    }
  }

  checkCurrentScreen() {
    let url = window.location.href;
    if (!this.service.getToken())
      this.navigatedTo();
    if (url.includes('construction-details') || url.includes('main') || url.includes('get-wages')) {
      this.showoptions = false
    }
    else if (url.includes('sign-in') || url.includes('sign-up')) {
      sessionStorage.removeItem('token'),
        sessionStorage.removeItem('project_id'),
        sessionStorage.removeItem('block_id'),
        sessionStorage.removeItem('payTo'),
        sessionStorage.removeItem('trade'),
        sessionStorage.removeItem('wages_number'),
        sessionStorage.removeItem('apartment_name')
      sessionStorage.removeItem('floor_number')
      sessionStorage.removeItem('appartmentId')
      sessionStorage.removeItem('floorId')
    }
    else {
      this.showoptions = true;
      this.service.showloader = false
      sessionStorage.removeItem('project_id'),
        sessionStorage.removeItem('block_id'),
        sessionStorage.removeItem('payTo'),
        sessionStorage.removeItem('trade'),
        sessionStorage.removeItem('wages_number'),
        sessionStorage.removeItem('apartment_name')
      sessionStorage.removeItem('floor_number')
      sessionStorage.removeItem('appartmentId')
      sessionStorage.removeItem('floorId')
      // this.navigatedTo();
    }
  }

  navigatedTo() {
    this.router.navigateByUrl('/sign-in');
  }

  toggleNavbar = () => {
    this.toggleNav = !this.toggleNav;
  }
}
