import { Component, OnInit } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { Column } from 'src/column.model';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  column: Array<Column> = new Array<Column>();
  first = 0;
  totalRecords = 0;
  data: any = [];
  modalHeading: any;
  msgs:any;
  userId: any

  constructor(public service: CommonService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.column.push({
      field: 'first_name',
      header: 'First Name'
    })
    this.column.push({
      field: 'last_name',
      header: 'Last Name'
    })
    this.column.push({
      field: 'email',
      header: 'Email'
    })
    this.column.push({
      field: 'user_role',
      header: 'Role'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.getDetails();
    this.primengConfig.ripple = true;
  }

  getDetails = () => {
    this.service.showloader = true;
    this.service.getRequest("user-list").subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.data = res.body.data.user_list;
        this.totalRecords = this.data.length;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
       this.confirm(res.body.message,'Error',null);
      }
    })
  }

  updateStatus(id : any,value: any){
    this.service.showloader = true;
    let body = {
      "id": id,
      "role_request": value
    }
    this.service.postRequest("update-user", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.data = [];
        this.getDetails();
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null);
      }
    })

  }

  accept = () => {
    this.confirmationService.close();
    if(this.modalHeading  == 'Delete User')
    this.updateStatus(this.userId,'delete')
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }

  reject = () => {
    this.confirmationService.close();
  }

  confirm(message: any, heading: any,id: any) {
    this.modalHeading = heading;
    this.userId = id
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }
}
