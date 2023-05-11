import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { Column } from 'src/column.model';
import { CommonService } from '../common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-get-wages',
  templateUrl: './get-wages.component.html',
  styleUrls: ['./get-wages.component.css']
})
export class GetWagesComponent implements OnInit {
  column: Array<Column> = new Array<Column>();
  data: any = [];
  editOption: Array<boolean> = [];
  selectedRowIndex: any;
  editForm: FormGroup;
  first = 0;
  totalRecords = 0;
  subTotal = 0;
  downloadWages:boolean = false
  editAndDeletePermission = 0;
  modalHeading: any;
  msgs: any;
  selectedRowIndexDelete: any;
  errorMessage: Array<boolean> = [];
  imageUrl: any;

  constructor(public service: CommonService, private confirmationService: ConfirmationService,  private modal: NgbModal, private primengConfig: PrimeNGConfig) {
    this.editForm = new FormGroup({
      "amount": new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.service.showloader = true;
    this.column.push({
      field: 'project_name',
      header: 'Project Name'
    })
    this.column.push({
      field: 'block_name',
      header: 'Block Name'
    })
    this.column.push({
      field: 'apartment_number',
      header: 'Appartment Name'
    })
    this.column.push({
      field: 'level',
      header: 'Level'
    })
    this.column.push({
      field: 'description_work',
      header: 'Description'
    })
    this.column.push({
      field: 'sub_description_header',
      header: 'Sub Description'
    })
    this.column.push({
      field: 'trade',
      header: 'Trade'
    })
    this.column.push({
      field: 'pay_to',
      header: 'Pay To'
    })
    this.column.push({
      field: 'amount',
      header: 'Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.getWages();
    this.primengConfig.ripple = true;
  }

  getWages = () => {
    this.service.showloader = true;
    let body = {
      "no_of_records": 10000,
      "page_no": 1,
      "project_id": sessionStorage.getItem('project_id'),
      // "block_id": sessionStorage.getItem('block_id'),
      "user_id": sessionStorage.getItem('user_id'),
      "wages_number":sessionStorage.getItem('wages_number')
    }
    this.service.postRequest("get-wages", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.data = res.body.data.wages_details;
        this.totalRecords = this.data.length;
        this.editAndDeletePermission = res.body.data.edit_and_delete_permission;
        this.subTotal = res.body.data.total_booking.toFixed(2);
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null);
      }
    })
  }

  editDetail = (index: any) => {
    this.selectedRowIndex = index;
    this.editOption[index] = true;
    this.amountCheck(index);
    for (let i = 0; i < this.data.length; i++) {
      if (i == this.selectedRowIndex) {
        this.editForm.get('amount')?.setValue(this.data[i].amount);
      }
      else {
        this.editOption[i] = false;
      }
    }
  }

  amountCheck = (index: any) => {
    this.selectedRowIndex = index;
    for (let i = 0; i < this.data.length; i++) {
      if (i == this.selectedRowIndex) {
        if (Number(this.editForm.get('amount')?.value) > (Number(this.data[i].remaining_amount) + Number(this.data[i].amount))) {
          this.errorMessage[index] = true;
        }
        else {
          this.errorMessage[index] = false;
        }
      }
    }
  }

  saveDetail = () => {
    this.service.showloader = true;
    let body: any;
    for (let i = 0; i < this.data.length; i++) {
      if (i == this.selectedRowIndex) {
        body = {
          "id": this.data[i].id,
          "project_id": this.data[i]?.project_id,
          "pay_to": this.data[i]?.pay_to,
          "trade": this.data[i]?.trade,
          "level": this.data[i]?.level,
          "block_id": this.data[i]?.block_id,
          "apartment_id": this.data[i]?.apartment_id,
          "floor_id": this.data[i]?.floor_id,
          "plot_or_room": this.data[i]?.plot_or_room,
          "description_work": this.data[i]?.description_work,
          "main_description_id": this.data[i]?.main_description_id,
          "sub_description_id": this.data[i]?.sub_description_id,
          "m2_or_hours": this.data[i]?.m2_or_hours,
          "rate": this.data[i]?.rate,
          "old_amount": this.data[i]?.amount,
          "sum": this.editForm.get('amount')?.value
        }
      }
    }
    this.service.postRequest("edit-booked-wages", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.service.showloader = false;
        this.editOption[this.selectedRowIndex] = false;
        this.getWages()
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null);
      }
    })

  }

  deleteDetail = () => {
    let body: any;

    for (let i = 0; i < this.data.length; i++) {
      if (i == this.selectedRowIndexDelete) {
        body = {
          "id": this.data[i].id,
        }
      }
    }
    this.service.postRequest("delete-booked-wages", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.service.showloader = false;
        this.editOption[this.selectedRowIndex] = false;
        this.getWages();
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null);
      }
    })
  }

  number(number: any) {
    return Number(number)
  }

  confirm(message: any, heading: any, index: any) {
    this.selectedRowIndexDelete = index;
    this.modalHeading = heading;
    if (this.modalHeading == 'Save Wages') {
      if (this.errorMessage[this.selectedRowIndex])
        return;
    }
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }

  accept = () => {
    this.confirmationService.close();
    if (this.modalHeading == 'Delete Wages')
      this.deleteDetail();
    if (this.modalHeading == 'Save Wages') {
      this.saveDetail();
    }
    if (this.modalHeading == 'Final Submit')
      this.finalSubmit()
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }

  finalSubmit = () => {
    this.service.showloader = true;
    let body = {
      "user_id": sessionStorage.getItem('user_id'),
      "project_id": sessionStorage.getItem('project_id'),
      "wages_number":sessionStorage.getItem('wages_number')
    }
    this.service.postRequest("final-wages-submission", body).subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.service.showloader = false;
        this.getWages();
        let link = document.createElement('a');
        this.imageUrl = res.body.data.excel_url;
        link.setAttribute('href', this.imageUrl);
        link.setAttribute('download', 'Wages_Booking' + '.xlsx');
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null);
      }
    })

  }

  reject = () => {
    this.confirmationService.close();
  }
  navigatedTo = () => {
    window.history.back();
  }
}
