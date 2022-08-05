import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  projectForm: FormGroup;
  submitted: boolean = false;
  payTo: any = [];
  payToCode: any;
  msgs: any;
  tradeList: any = [];

  constructor(private router: Router, public service: CommonService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.projectForm = new FormGroup({
      "project_name": new FormControl('PS', Validators.required),
      "block_name": new FormControl('PS', Validators.required)
    })
  }

  getPayToDropdown = () => {
    let body = {
      "no_of_records": 1000,
      "page_no": 1
    }
    this.service.postRequest("get-pay-to-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.payTo = res.body.data.pay_to_details;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }

  getTradeDropdown = () => {
    this.service.getRequest("get-lookup-value").subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
        for (let list of res.body.data.look_up) {
          if (list.type == 'trade') {
            this.tradeList.push(list)
          }
        }
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }


  navigatedTo = () => {
    this.submitted = true;
    if (this.projectForm?.get('project_name')?.value == 'PS' || this.projectForm?.get('block_name')?.value == 'PS')
      return;

    sessionStorage.setItem('trade', this.projectForm?.get('block_name')?.value);
    this.router.navigateByUrl('/construction-details');
  }
  ngOnInit(): void {
    this.service.showloader = true;
    this.getPayToDropdown();
    this.primengConfig.ripple = true;
    this.getTradeDropdown();
    this.checkCurrentScreen();
  }

  setPayToId(value: any) {
    value = value.pay_to_name
    this.payToCode = ''
    if (!value)
      return

    sessionStorage.setItem('payTo', value);
    for (let detail = 0; detail < this.payTo.length; detail++) {
      if (value == this.payTo[detail].pay_to_name)
        this.payToCode = this.payTo[detail].pay_to_code;
    }
  }
  reject = () => {
    this.confirmationService.close();
  }

  accept = () => {
    this.confirmationService.close();
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }

  confirm(message: any, heading: any) {
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }

  checkCurrentScreen() {
    let url = window.location.href;
    if (url.includes('main')) {
      sessionStorage.removeItem('project_id'),
        sessionStorage.removeItem('block_id'),
        sessionStorage.removeItem('wages_number'),
        sessionStorage.removeItem('apartment_name'),
        sessionStorage.removeItem('floor_number'),
        sessionStorage.removeItem('appartmentId'),
        sessionStorage.removeItem('floorId')
    }
  }

}
