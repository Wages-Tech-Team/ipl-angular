import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-add-pay-to',
  templateUrl: './add-pay-to.component.html',
  styleUrls: ['./add-pay-to.component.css']
})
export class AddPayToComponent implements OnInit {
  addpayTo: FormGroup;
  submitted: boolean = false;
  msgs: any;

  constructor(private router: Router, public service: CommonService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.addpayTo = new FormGroup({
      "pay_to": new FormControl('', Validators.required),
      "pay_to_code": new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  navigatedToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
  navigatedToAccount(){
    this.router.navigateByUrl('/get-user-details');
  }

  submitPayTo = () => {
    if (this.addpayTo.invalid) {
      this.submitted = true;
      return
    }
    this.submitted = false;

    this.service.showloader = true;
    let body = {
      "pay_to_name": this.addpayTo.get('pay_to')?.value,
      "pay_to_code": this.addpayTo.get('pay_to_code')?.value
    }
    this.service.postRequest("add-pay-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
        this.router.navigateByUrl('/main'); 
      }
      else {
      this.service.showloader = false;
      this.confirm(res.body.message, 'Error');
    }
    })
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
}
