import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { Column } from 'src/column.model';
import { CommonService } from '../common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-get-wages-report',
  templateUrl: './get-wages-report.component.html',
  styleUrls: ['./get-wages-report.component.css']
})
export class GetWagesReportComponent implements OnInit {
  column: Array<Column> = new Array<Column>();
  data: any = [];
  wagesNumber: any = [];
  editOption: Array<boolean> = [];
  selectedRowIndex: any;
  projectDetails: any;
  user_data:any;
  editForm: UntypedFormGroup;
  projectForm: UntypedFormGroup;
  downloadWagesForm: UntypedFormGroup;
  first = 0;
  totalRecords = 0;
  subTotal = 0;
  dobminDate: Date = new Date(2022, 12, 1);
  downloadWages:boolean = false
  editAndDeletePermission = 0;
  modalHeading: any;
  msgs: any;
  submitted:boolean = false;
  today : Date = new Date();
  currentDate: any;
  selectedRowIndexDelete: any;
  errorMessage: Array<boolean> = [];
  imageUrl: any;
  testDate: any;
  dateFromValue: Date = new Date();

  constructor(public service: CommonService, private confirmationService: ConfirmationService,  private modal: NgbModal, private primengConfig: PrimeNGConfig) {
    this.editForm = new UntypedFormGroup({
      "amount": new UntypedFormControl('', Validators.required)
    }),
    this.projectForm = new UntypedFormGroup({
      "project_name": new UntypedFormControl('PS'),
      "user_id": new UntypedFormControl('PS'),
      "wages_number": new UntypedFormControl('PS'),
      "wages_date": new UntypedFormControl('PS'),
   
    })
    this.downloadWagesForm = new UntypedFormGroup({});
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
    this.getWagesNumber();
    this.primengConfig.ripple = true;
    this.currentDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.projectForm.patchValue({
      'wages_date':this.currentDate
    })
  }

  
  getWagesNumber = () => {
    
    this.service.getRequest("get-lookup-value").subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
        for (let list of res.body.data.look_up) {
          if (list.type == 'wage-number') {
            this.wagesNumber.push(list.text)
          }
        }
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error',null);
      }
    })
  }

  

  getProjectData = (event: any) => {
    event = event?.target?.value ? event.target.value : event;
    this.service.showloader = true;
    let body = {
      "no_of_records": 100,
      "page_no": 1,
      "user_id": this.projectForm.get('user_id')?.value,
    }
    this.service.postRequest("get-project-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.projectDetails = res.body.data.project_details;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message,"Error", null);
      }
    }
    )
  }


  getUser = (event: any) => {
    event = event?.target?.value ? event.target.value : event;
    this.service.showloader = true;
    this.service.getRequest("user-list").subscribe(res => {
      if (res.body.success == true  || res.body.code == 1000) {
        this.user_data = res.body.data.user_list;
        this.totalRecords = this.data.length;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
       this.confirm(res.body.message,'Error',null);
      }
    })
  }

  submitDate = () => {
    this.projectForm.patchValue({
      'wages_date':this.dateFromValue
    })
    if ((this.projectForm.get('project_name')?.value != 'PS') && (this.projectForm.get('user_id')?.value != 'PS')){
      this.service.showloader = true;
      let body = {
        "no_of_records": 10000,
        "page_no": 1,
        "project_id": this.projectForm.get('project_name')?.value,
        // "block_id": sessionStorage.getItem('block_id'),
        "user_id":  this.projectForm.get('user_id')?.value,
        "wages_number": this.projectForm.get('wages_number')?.value,
        "date": this.projectForm.get('wages_date')?.value
      }
      this.service.postRequest("wages-report", body).subscribe(res => {
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
  }

  getWages = (event: any) => {
    event = event?.target?.value ? event.target.value : event;
    this.service.showloader = true;
    let body = {
      "no_of_records": 10000,
      "page_no": 1,
      "project_id": this.projectForm.get('project_name')?.value,
      // "block_id": sessionStorage.getItem('block_id'),
      "user_id":  this.projectForm.get('user_id')?.value,
      "wages_number": this.projectForm.get('wages_number')?.value,
      "date": this.projectForm.get('wages_date')?.value
    }
    this.service.postRequest("wages-report", body).subscribe(res => {
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
      //  this.deleteDetail();
        if (this.modalHeading == 'Save Wages') {
            //this.saveDetail();
        }
        if (this.modalHeading == 'Final Submit')
        //this.finalSubmit()
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
    }


    reject = () => {
        this.confirmationService.close();
    }
    navigatedTo = () => {
        window.history.back();
    }

  
    downloadWagesReport = () => {
      this.service.showloader = true;
          let body = {
            "no_of_records": 10000,
            "page_no": 1,
            "project_id": this.projectForm.get('project_name')?.value,
            "user_id":  this.projectForm.get('user_id')?.value,
            "wages_number": this.projectForm.get('wages_number')?.value,
            "date": this.projectForm.get('wages_date')?.value
          }
          this.service.postRequest("download-wages-report", body).subscribe(res => {
              if (res.body.success == true  || res.body.code == 1000) {
                  this.service.showloader = false;
                  this.reloadWages();
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

    reloadWages = () => {
      this.service.showloader = true;
      let body = {
        "no_of_records": 10000,
        "page_no": 1,
        "project_id": this.projectForm.get('project_name')?.value,
        // "block_id": sessionStorage.getItem('block_id'),
        "user_id":  this.projectForm.get('user_id')?.value,
        "wages_number": this.projectForm.get('wages_number')?.value,
        "date": this.projectForm.get('wages_date')?.value
      }
      this.service.postRequest("wages-report", body).subscribe(res => {
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

    canceldownloadWagesModal(){
        this.downloadWagesForm =new UntypedFormGroup({});
        this.modal.dismissAll();
    }

    download = () => {
        this.service.showloader = true;
        this.modal.dismissAll();
        let body = {
            "no_of_records": 1000000,
            "page_no": 1,
            "project_id": sessionStorage.getItem('project_id'),
            "user_id": sessionStorage.getItem('user_id'),
            "wages_number": sessionStorage.getItem('wages_number'),
            'wages_date': this.downloadWagesForm?.get('wages_date')?.value ? this.service.dateToUTC(this.downloadWagesForm?.get('wages_date')?.value) : '',
        }
        this.service.postRequest("download-wages", body).subscribe(res => {
            if (res.body.code == 1001) {
                this.service.showloader = false;
                this.confirm(res.body.message, 'Download Wages', null);
            }
            else if (res.body.success == true || res.body.code == 1000) {
                this.service.showloader = false;
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
                this.confirm(res.body.message,  'Download Wages', null);
            }
        })
    }

}
