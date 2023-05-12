import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signIn: UntypedFormGroup;
  submitted: boolean = false;
  msgs: any;

  constructor(private router: Router, public service: CommonService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.signIn = new UntypedFormGroup({
      "name": new UntypedFormControl('', [Validators.required, Validators.pattern(this.service.emailPattern)]),
      "password": new UntypedFormControl('', [Validators.required, Validators.pattern(this.service.password)])
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  submit = () => {
    this.submitted = true;
    if (this.signIn.invalid)
      return;

    this.service.showloader = true;
    let body = {
      "email": this.signIn.get('name')?.value,
      "password": this.signIn.get('password')?.value,
      "recaptcha_token": "pass_recaptcha"
    }
    this.service.postRequest("login", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.setToken(res.body.data.user.token);
        this.service.setRole(res?.body?.data?.user?.user_role);
        sessionStorage.setItem('user_id', res.body.data.user.id)
        this.navigatedTo();
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }

  navigatedTo() {
    if (this.service.getRole() == "admin")
      this.router.navigateByUrl('/upload-excel');
    else
      this.router.navigateByUrl('/main');
  }

  navigatedToSignUp() {
    this.router.navigateByUrl('/sign-up');
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
