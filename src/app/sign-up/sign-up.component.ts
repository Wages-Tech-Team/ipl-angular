import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUp: FormGroup;
  submitted: boolean = false;
  msgs: any;

  constructor(private router: Router, public service: CommonService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.signUp = new FormGroup({
      "email": new FormControl('', [Validators.required, Validators.pattern(this.service.emailPattern)]),
      "firstName": new FormControl('', [Validators.required, Validators.minLength(2)]),
      "lastName": new FormControl('', [Validators.required, Validators.minLength(2)]),
      "password": new FormControl('', [Validators.required, Validators.pattern(this.service.password)]),
      "confirmPassword": new FormControl('', [Validators.required, Validators.pattern(this.service.password)]),
      "user_role": new FormControl('')
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  submit = () => {
    this.submitted = true;
    if (this.signUp.invalid)
      return;

    this.service.showloader = true;
    let body = {
      "first_name": this.signUp.get('firstName')?.value,
      "last_name": this.signUp.get('lastName')?.value,
      "email": this.signUp.get('email')?.value,
      "password": this.signUp.get('password')?.value,
      "user_role":this.signUp.get('user_role')?.value
    }
    this.service.postRequest("register", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) { 
      this.navigatedTo();
      this.service.showloader = false;
    }
    else {
      this.service.showloader = false;
      this.confirm(res.body.message, 'Error');
    }})
  }

  navigatedTo() {
    this.router.navigateByUrl('/sign-in');
  }
  reject = () => {
    this.confirmationService.close();
  }

  getUserRole(role : any){
    this.signUp.get('user_role')?.setValue(role);
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
