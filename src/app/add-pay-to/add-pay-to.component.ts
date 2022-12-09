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
  payTo: any = [];
  heading: any;
  filename: any;
  filenameDescription: any;
  errorMessage: string ='';
  uploadedFile: any;
  uploadedFileDescription: any;

  constructor(private router: Router, public service: CommonService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.addpayTo = new FormGroup({
      "pay_to": new FormControl('', Validators.required),
      "pay_to_code": new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getPayToDropdown();
  }
  navigatedToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
  navigatedToAccount(){
    this.router.navigateByUrl('/get-user-details');
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
  
  setPayToId(value: any) {
    value = value.pay_to_name
    if (!value)
      return
    this.addpayTo?.get('pay_to_code')?.setValue('');
    sessionStorage.setItem('payTo', value);
    for (let detail = 0; detail < this.payTo.length; detail++) {
      if (value == this.payTo[detail].pay_to_name)
      this.addpayTo?.get('pay_to_code')?.setValue(this.payTo[detail].pay_to_code);
    }
  }

  deletePayTo = (value: any) => {
    this.service.showloader = true;
    let body: any;
        body = {
          "id": value.id,
        }
    this.service.postRequest("delete-pay-details", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.service.showloader = false;
        this.getPayToDropdown();
        this.confirm('Successfully Deleted !', '');
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
    if(this.heading=='Delete Detail')
    this.deletePayTo(this.addpayTo?.get('pay_to')?.value);
    if(this.heading=='Upload Project')
    this.upload();
    if(this.heading=='Upload Project Description')
    this.upload_description();
    
  }

  confirm(message: any, heading: any) {
    if(heading=='Delete Detail')
    this.submitted = true;

    if (!this.filename && heading == 'Upload Project') {
      this.errorMessage = "Please Upload the file."
      return
    }

    if (!this.filenameDescription && heading == 'Upload Project Description') {
      this.errorMessage = "Please Upload the file."
      return
    }

    if(heading=='Delete Detail' && this.addpayTo?.invalid)
    return;

    this.heading= heading;
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }
  
  delete() {
    this.filename = ''
  }

  deleteDescription() {
    this.filenameDescription = ''
  }
  
  handleFileUpload(event: any) {
    let files = event.target.files;
    this.uploadedFile = files[0]
    this.filename = files[0].name;
  }

  handleFileUploadDescription(event_1: any) {
    let filesDescription = event_1.target.files;
    this.uploadedFileDescription = filesDescription[0]
    this.filenameDescription = filesDescription[0].name;
  }

  upload = () => {
    if (!this.uploadedFile)
      return;

    this.service.showloader = true;
    let data = new FormData();
    data.append("request[file]", this.uploadedFile);
    this.service.postRequestForUpload("upload-pay-details", data).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }

  upload_description = () => {
    if (!this.uploadedFileDescription)
      return;

    this.service.showloader = true;
    let data = new FormData();
    data.append("request[file]", this.uploadedFileDescription);
    this.service.postRequestForUpload("import-main-excel", data).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }
}
