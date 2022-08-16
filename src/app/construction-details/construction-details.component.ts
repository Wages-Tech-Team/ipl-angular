import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { Column } from 'src/column.model';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-construction-details',
  templateUrl: './construction-details.component.html',
  styleUrls: ['./construction-details.component.css'],
  providers: [ConfirmationService]
})
export class ConstructionDetailsComponent implements OnInit {
  column: Array<Column> = new Array<Column>();
  nestedcolumns: Array<Column> = new Array<Column>();
  data: any = [];
  nestedcolumn: any = [];
  apartmentDetails: any;
  selectedRowIndex: number = 0;
  blockDetails: any;
  projectForm: FormGroup;
  projectDetails: any;
  showerror: Array<boolean> = [];
  totalAmount: any;
  message: any = [];
  msgs: Message[] = [];
  imageUrl: string = '';
  appartmentids = [];
  floorids = [];
  percentageAmount: Array<any> = [];
  bookingAmount: Array<any> = [];
  selectionType: String = 'null';
  selectedFloorType: String = 'null';
  bookWages: Array<any> = [];
  apartmentName: Array<any> = [];
  wagesNumber: any = [];
  editOption: Array<boolean> = [];
  editedRowId: any;
  selectedTable: any;
  wages: FormGroup;
  floorDetails: any;
  floorName: Array<any> = [];
  enteredValue: any;
  stock_hit_time: number = 2 * 60 * 1000;

  constructor(private router: Router, public service: CommonService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    this.projectForm = new FormGroup({
      "project_name": new FormControl('PS'),
      "block_name": new FormControl('PS'),
      "apartment_name": new FormControl('PS'),
      "wages_number": new FormControl('PS'),
      "floor_number": new FormControl('PS')
    })
    this.wages = new FormGroup({
      "area": new FormControl(''),
      "unit": new FormControl(''),
      "lab_rate": new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.service.showloader = true;
    this.getProjectData();
    this.primengConfig.ripple = true;
    this.getWagesNumber();
    this.saveFlow();
    this.checkAvailablity();
  }

  getWagesNumber = () => {
    for (let i = 199; i <= 1000; i++)
      this.wagesNumber.push(i);
  }

  saveFlow() {
    this.projectForm.get('project_name')?.setValue(sessionStorage.getItem('project_id') ? sessionStorage.getItem('project_id') : 'PS');
    if (this.projectForm.get('project_name')?.value)
      this.getBlockData(this.projectForm.get('project_name')?.value);
    this.projectForm.get('block_name')?.setValue(sessionStorage.getItem('block_id') ? sessionStorage.getItem('block_id') : 'PS');
    this.projectForm.get('wages_number')?.setValue(sessionStorage.getItem('wages_number') ? sessionStorage.getItem('wages_number') : 'PS');
    if (this.projectForm.get('block_name')?.value)
      this.getFloorData();
    this.projectForm.get('apartment_name')?.setValue(sessionStorage.getItem('apartment_name') ? sessionStorage.getItem('apartment_name') : 'PS');
    this.projectForm.get('floor_number')?.setValue(sessionStorage.getItem('floor_number') ? sessionStorage.getItem('floor_number') : 'PS');
    if (this.projectForm.get('apartment_name')?.value) {
      this.getConstructionData(this.projectForm.get('apartment_name')?.value, null, 'apartment')
    }
    this.projectForm.get('apartment_name')?.setValue(sessionStorage.getItem('apartment_name') ? sessionStorage.getItem('apartment_name') : 'PS');
    if (this.projectForm.get('floor_number')?.value) {
      this.getConstructionData(this.projectForm.get('floor_number')?.value, null, 'floor')
    }
    this.projectForm.get('apartment_name')?.setValue(sessionStorage.getItem('apartment_name') ? sessionStorage.getItem('apartment_name') : 'PS');
    if(sessionStorage.getItem('floorId') && sessionStorage.getItem('appartmentId')) {
      this.floorids = JSON.parse(String(sessionStorage.getItem('floorId')));
      this.appartmentids = JSON.parse(String(sessionStorage.getItem('appartmentId')));
    }
    if (sessionStorage.getItem('floorId')) {
      this.floorids = JSON.parse(String(sessionStorage.getItem('floorId')));
      this.getDescription(this.floorids, null, 'floor');
    }
    if (sessionStorage.getItem('appartmentId')) {
      this.appartmentids = JSON.parse(String(sessionStorage.getItem('appartmentId')));
      this.getDescription(this.appartmentids, null, 'aparment')
    }
    this.checkAvailablity()
  }

  getFloorData = () => {
    this.column = [];
    this.column.push({
      field: 'description_header',
      header: 'Booking Description'
    })
    this.column.push({
      field: 'total',
      header: 'Total Allowance'
    })
    this.column.push({
      field: 'total',
      header: 'Remaining Booking Amount'
    })
    this.column.push({
      field: '',
      header: 'Booking Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.service.showloader = true;
    this.projectForm.get('apartment_name')?.setValue('PS');
    this.apartmentDetails = []
    this.data = [];
    if (this.projectForm.get('project_name')?.value != 'PS' && this.projectForm.get('block_name')?.value != 'PS') {
      let body = {
        "no_of_records": 100,
        "page_no": 1,
        "project_id": this.projectForm.get('project_name')?.value,
        "block_id": this.projectForm.get('block_name')?.value,
      }
      this.service.postRequest("get-floor-details", body).subscribe(res => {
        if (res.body.success == true || res.body.code == 1000) {
          // this.apartmentDetails = res.body.data.apartment_details;
          this.floorDetails = res.body.data.floor_details;
          this.service.showloader = false;
        }
        else {
          this.service.showloader = false;
          this.message[0] = true;
          this.confirm1(res.body.message, null);
        }
      }
      )
    }
    else {
      this.service.showloader = false;
    }
  }

  getApartmentData = () => {
    if(this.projectForm.get('floor_number')?.value == 'PS' && this.floorids.length == 0){
      this.apartmentDetails = []
    return
    }

    this.column = [];
    this.column.push({
      field: 'description_header',
      header: 'Booking Description'
    })
    this.column.push({
      field: 'total',
      header: 'Total Allowance'
    })
    this.column.push({
      field: 'total',
      header: 'Remaining Booking Amount'
    })
    this.column.push({
      field: '',
      header: 'Booking Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.service.showloader = true;
    this.projectForm.get('apartment_name')?.setValue('PS');
    this.apartmentDetails = []
    this.data = [];
    if (this.projectForm.get('project_name')?.value != 'PS' && this.projectForm.get('block_name')?.value != 'PS') {
      let body = {
        "no_of_records": 100,
        "page_no": 1,
        "project_id": this.projectForm.get('project_name')?.value,
        "block_id": this.projectForm.get('block_name')?.value,
        "floor_id": this.projectForm.get('floor_number')?.value != 'PS' ? this.projectForm.get('floor_number')?.value : this.floorids
      }
      this.service.postRequest("get-apartment-details", body).subscribe(res => {
        if (res.body.success == true || res.body.code == 1000) {
          this.apartmentDetails = res.body.data.apartment_details;
          // this.floorDetails = res.body.data.floor_details;
          this.service.showloader = false;
        }
        else {
          this.service.showloader = false;
          this.message[0] = true;
          this.confirm1(res.body.message, null);
        }
      }
      )
    }
    else {
      this.service.showloader = false;
    }
  }

  edit = (detailIndex: any, index: any) => {
    this.editedRowId = index;
    this.selectedTable = detailIndex;
    this.editOption[index] = true;
    for (let mainIndex = 0; mainIndex < this.data.length; mainIndex++) {
      if (mainIndex == this.selectedRowIndex) {
        for (let index = 0; index < this.data[mainIndex].sub_description_records.length; index++) {
          if (this.selectedTable == index) {
            for (let subDetailIndex = 0; subDetailIndex < this.data[mainIndex].sub_description_records[index].records.length; subDetailIndex++) {
              if (subDetailIndex == this.editedRowId) {
                this.wages.get('area')?.setValue(this.data[mainIndex].sub_description_records[index].records[subDetailIndex].area);
                this.wages.get('unit')?.setValue(this.data[mainIndex].sub_description_records[index].records[subDetailIndex].unit);
                this.wages.get('lab_rate')?.setValue(this.data[mainIndex].sub_description_records[index].records[subDetailIndex].lab_rate);
              }
            }
          }
        }
      }
    }
  }
  deSelectOption() {
    this.editOption = [false];
  }

  deleteOption = () => {
    this.editOption[this.editedRowId] = false;
  }

  checkAvailablity() {
    if (this.projectForm.get('wages_number')?.value == 'PS') {
      this.projectForm.get('project_name')?.setValue('PS');
      this.projectForm.get('block_name')?.setValue('PS');
      this.projectForm.get('apartment_name')?.setValue('PS');
      this.projectForm.get('floor_number')?.setValue('PS');
      this.projectForm.get('project_name')?.disable();
      this.projectForm.get('block_name')?.disable();
      this.projectForm.get('apartment_name')?.disable();
      this.projectForm.get('floor_number')?.disable();
      this.selectedFloorType = 'single';
      this.selectionType = 'single';
    }
    else {
      this.projectForm.get('project_name')?.enable();
      this.projectForm.get('block_name')?.enable();
      this.projectForm.get('apartment_name')?.enable();
      this.projectForm.get('floor_number')?.enable();
      this.selectedFloorType = 'null';
      this.selectionType = 'null';
    }
    if (sessionStorage.getItem('appartmentId')) {
      this.selectionType = 'null';
      this.selectedFloorType = 'null';
      this.projectForm.get('apartment_name')?.disable();
      this.projectForm.get('floor_number')?.disable();
    }
    if (sessionStorage.getItem('floorId')) {
      this.selectionType = 'null';
      this.selectedFloorType = 'null';
      this.projectForm.get('apartment_name')?.disable();
      this.projectForm.get('floor_number')?.disable();
    }
    if (sessionStorage.getItem('apartment_name')) {
      this.selectionType = 'single';
      this.projectForm.get('apartment_name')?.enable();
      this.projectForm.get('floor_number')?.enable();
    }
    if (sessionStorage.getItem('floor_number')) {
      this.selectedFloorType = 'single';
      this.projectForm.get('apartment_name')?.enable();
      this.projectForm.get('floor_number')?.enable();
    }
  }

  save = () => {
    if (!this.wages.get('area')?.value && !this.wages.get('unit')?.value && !this.wages.get('lab_rate')?.value)
      return;

    let body: any;
    for (let mainIndex = 0; mainIndex < this.data.length; mainIndex++) {
      if (mainIndex == this.selectedRowIndex) {
        for (let index = 0; index < this.data[mainIndex].sub_description_records.length; index++) {
          if (this.selectedTable == index) {
            for (let subDetailIndex = 0; subDetailIndex < this.data[mainIndex].sub_description_records[index].records.length; subDetailIndex++) {
              if (subDetailIndex == this.editedRowId) {
                body = {
                  "id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].id,
                  "project_id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].project_id,
                  "block_id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].block_id,
                  "apartment_id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].apartment_id,
                  "main_description_id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].main_description_id,
                  "sub_description_id": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].sub_description_id,
                  "description": this.data[mainIndex].sub_description_records[index].records[subDetailIndex].description,
                  "area": this.wages.get('area')?.value,
                  "unit": this.wages.get('unit')?.value,
                  "lab_rate": this.wages.get('lab_rate')?.value
                }
              }
            }
          }
        }
      }
    }
    this.service.showloader = true;
    this.data = []
    this.service.postRequest("edit-construction-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.editOption[this.editedRowId] = false;
        if (this.projectForm.get('apartment_name')?.value != 'PS')
          this.getConstructionData(this.projectForm.get('apartment_name')?.value, 'save', 'apartment');
        else
          this.getConstructionData(this.projectForm.get('floor_number')?.value, 'save', 'floor');
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm1(res.body.message, null);
      }
    }
    )
  }

  selectedRow(index: number) {
    this.selectedRowIndex = index;
    this.wages.get('area')?.setValue(''),
      this.wages.get('unit')?.setValue(''),
      this.wages.get('lab_rate')?.setValue('')
  }

  calculate = (row: number, event: any) => {
    for (let i = 0; i < this.data.length; i++) {
      this.message[i] = false;
    }
    event = Number(event.target.value);
    if(event == 0){
      this.showerror[row] = true;
      this.enteredValue = event
    }
    if (event) {
      if (Number((this.data[row].total - this.data[row].total_amount_booked).toFixed(2)) < event) {
        this.showerror[row] = true;
        this.enteredValue = event
      }
      else {
        this.totalAmount = event;
        this.showerror[row] = false;
        this.enteredValue = event
      }
    }
  }

  getBookingAmount(event: any, rowId: number) {
    event = event.target.value;
    this.percentageAmount[rowId] = event;
    this.bookingAmount[rowId] = 0;
    for (let id = 0; id < this.data.length; id++) {
      if (rowId == id) {
        for (let record = 0; record < this.data[id].records.length; record++) {
          this.bookingAmount[rowId] = this.bookingAmount[rowId] + ((event / 100) * this.data[id].records[record].remaining_booking_amount);
        }
      }
    }
    this.bookingAmount[rowId] = Number(this.bookingAmount[rowId]).toFixed(2)
  }

  addWages = (index: number) => {
    if (this.projectForm.get('wages_number')?.value == 'PS') {
      this.confirm1('Please Select Wages Number !', null);
      return
    }
    if((this.appartmentids.length >0 || this.floorids.length >0) && this.bookingAmount[index] <= 0)
    return;
    
    if (((this.appartmentids.length == 0 && this.floorids.length == 0) ? !this.totalAmount : (!this.percentageAmount[index] || this.percentageAmount[index] > 100)) || this.showerror[index] || this.projectForm.get('wages_number')?.value == 'PS')
      return;

    this.service.showloader = true;
    this.bookWages = []
    for (let i = 0; i < this.data.length; i++) {
      this.message[i] = false;
    }
    if (this.appartmentids.length > 0 || this.floorids.length > 0) {
      let i = 0;
      if (this.apartmentDetails.length > 0) {
        this.appartmentids = this.appartmentids.sort(function(a, b){return a - b});
        for (let name = 0; name < this.apartmentDetails.length; name++) {
          if (this.appartmentids[i] == this.apartmentDetails[name].id) {
            this.apartmentName[i] = this.apartmentDetails[name].apartment_number;
            i++
          }
        }
      }
      i = 0;
      if (this.floorids.length > 0) {
        this.floorids = this.floorids.sort(function(a, b){return a - b});        ;
        for (let name = 0; name < this.floorDetails.length; name++) {
          if (this.floorids[i] == this.floorDetails[name].id) {
            this.floorName[i] = this.floorDetails[name].floor_name;
            i++
          }
        }
      }
      for (let i = 0; i < this.data.length; i++) {
        if (index == i) {
          for (let j = 0; j < this.data[i].records.length; j++) {
            if ((this.data[i].records[j].apartment_id == this.appartmentids[j]) || (this.data[i].records[j].floor_id == this.floorids[j])) {
              this.bookWages.push({
                "project_id": this.projectForm.get('project_name')?.value,
                "block_id": this.projectForm.get('block_name')?.value,
                "pay_to": sessionStorage.getItem('payTo'),
                "trade": sessionStorage.getItem('trade'),
                "level":  this.floorName[j] ? this.floorName[j] : '',
                "apartment_id": this.appartmentids[j],
                "plot_or_room": this.apartmentName[j] ? this.apartmentName[j] : this.floorName[j],
                "description_work": this.data[index]?.description_header,
                "main_description_id": this.data[index]?.records[j]?.main_description_id,
                "m2_or_hours": "",
                "rate": "",
                "sum": Number(Number((this.percentageAmount[index] / 100) * this.data[index]?.records[j]?.remaining_booking_amount).toFixed(2)),
                "wages": this.projectForm.get('wages_number')?.value,
                "user_id": sessionStorage.getItem('user_id'),
                "floor_id": this.data[index]?.records[j]?.floor_id
              })
            }
          }
        }
      }
    }
    else {
      for (let detail = 0; detail < this.apartmentDetails.length; detail++) {
        if (this.projectForm.get('apartment_name')?.value == this.apartmentDetails[detail].id) {
          this.apartmentName[0] = this.apartmentDetails[detail].apartment_number;
        }
      }
      for (let detail = 0; detail < this.floorDetails.length; detail++) {
        if (this.projectForm.get('floor_number')?.value == this.floorDetails[detail].id) {
          this.floorName[0] = this.floorDetails[detail].floor_name;
        }
      }
      this.bookWages.push({
        "project_id": this.projectForm.get('project_name')?.value,
        "block_id": this.projectForm.get('block_name')?.value,
        "pay_to": sessionStorage.getItem('payTo'),
        "trade": sessionStorage.getItem('trade'),
        "level": this.floorName[0] ? this.floorName[0] : '',
        "apartment_id": this.projectForm.get('apartment_name')?.value != 'PS' ? this.projectForm.get('apartment_name')?.value : '',
        "plot_or_room": this.apartmentName[0] ? this.apartmentName[0] : this.floorName[0],
        "description_work": this.data[index]?.description_header,
        "main_description_id": this.data[index]?.sub_description_records[0]?.records[0]?.main_description_id,
        "m2_or_hours": "",
        "rate": "",
        "sum": Number(this.totalAmount).toFixed(2),
        "wages": this.projectForm.get('wages_number')?.value,
        "user_id": sessionStorage.getItem('user_id'),
        "floor_id": this.data[index]?.sub_description_records[0]?.records[0]?.floor_id
      })
    }

    let body = {
      "book_wages": this.bookWages
    }
    this.service.postRequest("book-wages", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.message[index] = true;
        this.message[0] = true;
        if (this.projectForm.get('apartment_name')?.value != 'PS')
          this.getConstructionData(this.projectForm.get('apartment_name')?.value, 'addWages', 'apartment');
        if (this.projectForm.get('floor_number')?.value != 'PS')
          this.getConstructionData(this.projectForm.get('floor_number')?.value, 'addWages', 'floor');
        if (this.appartmentids.length > 0)
          this.getDescription(this.appartmentids, 'addWages', 'aparment');
        if (this.floorids.length > 0)
          this.getDescription(this.floorids, 'addWages', 'floor');
        this.percentageAmount[index] = '';
        this.bookingAmount[index] = ''
      }
      else {
        this.service.showloader = false;
        this.message[0] = true;
        this.percentageAmount[index] = '';
        this.bookingAmount[index] = ''
        this.confirm1(res.body.message, null);
      }
    }
    )
  }

  getConstructionData = (event: any, value: any, type: any) => {
    this.totalAmount= []
    this.showerror=[]
    this.bookingAmount=[]
    this.percentageAmount = []
    if (type == 'apartment') {
      this.appartmentids = [];
      this.selectionType = 'single';
      this.projectForm.get('apartment_name')?.enable();
      this.projectForm.get('floor_number')?.enable();
    }
    if (type == 'floor') {
      this.floorids = [];
      this.selectedFloorType = 'single';
      this.projectForm.get('floor_number')?.enable();
      this.projectForm.get('apartment_name')?.enable();
      if(value != 'addWages')
      this.getApartmentData();
    }
    // if (value != 'addWages') {
    //   for (let i = 0; i < this.data.length; i++) {
    //     this.message[i] = false;
    //   }
    // }

    if (event == 'PS' || this.projectForm.get('floor_number')?.value == 'PS') {
      this.selectionType = '';
      this.selectedFloorType = '';
      return
    }
    this.service.showloader = true;
    this.column = [];
    this.column.push({
      field: 'description_header',
      header: 'Booking Description'
    })
    this.column.push({
      field: 'total',
      header: 'Total Allowance'
    })
    this.column.push({
      field: 'total',
      header: 'Remaining Booking Amount'
    })
    this.column.push({
      field: '',
      header: 'Booking Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    event = event?.target?.value ? event?.target?.value : event;
    if (event == 'PS' && type == 'apartment')
      this.selectionType = 'null';
    if (event == 'PS' && type == 'floor')
      this.selectedFloorType = 'null';

    this.nestedcolumns = [];
    // if(type =='floor'){
    //   this.service.showloader = false;
    // return
    // }
    let body = {
      "no_of_records": 100,
      "page_no": 1,
      "project_id": this.projectForm.get('project_name')?.value,
      "block_id": this.projectForm.get('block_name')?.value,
      "apartment_id": this.projectForm.get('apartment_name')?.value != 'PS' ? this.projectForm.get('apartment_name')?.value : '',
      "floor_id": this.projectForm.get('floor_number')?.value != 'PS' ? this.projectForm.get('floor_number')?.value : '',
    }
    this.service.postRequest("get-construction-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.data = res.body.data.construction_details;
        this.nestedcolumns = [];
        this.nestedcolumns.push(
          { field: 'description', header: 'Work Description' },
          { field: 'area', header: 'Area' },
          { field: 'unit', header: 'Unit' },
          { field: 'lab_rate', header: 'Lab Rate' },
          { field: 'total', header: 'Total' },
          // { field: '', header: '' },
        )
        this.totalAmount = '';
        this.service.showloader = false;
        if (value == 'addWages')
          this.confirm1('Wages Added Successfully !', null);
      }
      else {
        this.service.showloader = false;
        this.message[0] = true;
        this.confirm1(res.body.message, null);
      }
    }
    )
  }


  getProjectData = () => {
    this.selectionType = 'null';
    this.selectedFloorType = 'null'
    this.projectForm.get('apartment_name')?.enable();
    this.projectForm.get('floor_number')?.enable();
    this.appartmentids = [];
    this.floorids = [];
    this.column = [];
    this.column.push({
      field: 'description_header',
      header: 'Booking Description'
    })
    this.column.push({
      field: 'total',
      header: 'Total Allowance'
    })
    this.column.push({
      field: 'total',
      header: 'Remaining Booking Amount'
    })
    this.column.push({
      field: '',
      header: 'Booking Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.service.showloader = true;
    let body = {
      "no_of_records": 100,
      "page_no": 1
    }
    this.service.postRequest("get-project-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.projectDetails = res.body.data.project_details;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.message[0] = true;
        this.confirm1(res.body.message, null);
      }
    }
    )
  }

  getBlockData = (event: any) => {
    this.selectionType = 'null';
    this.selectedFloorType = 'null';
    this.projectForm.get('apartment_name')?.enable();
    this.projectForm.get('floor_number')?.enable();
    this.appartmentids = [];
    this.floorids = [];
    event = event?.target?.value ? event.target.value : event;
    if (event == 'PS')
      return;
    this.service.showloader = true;
    this.projectForm.get('block_name')?.setValue('PS');
    this.projectForm.get('apartment_name')?.setValue('PS');
    let body = {
      "no_of_records": 100,
      "page_no": 1,
      "project_id": event
    }
    this.service.postRequest("get-block-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.blockDetails = res.body.data.block_details;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.message[0] = true;
        this.confirm1(res.body.message, null);
      }
    }
    )
  }

  navigatedTo = () => {
    window.history.back();
  }

  navigatedTowages = () => {
    if (this.projectForm.get('project_name')?.value == 'PS') {
      this.confirm1('Please Select Project !', null);
      return;
    }

    sessionStorage.setItem('project_id', this.projectForm.get('project_name')?.value);
    sessionStorage.setItem('block_id', this.projectForm.get('block_name')?.value);
    sessionStorage.setItem('wages_number', this.projectForm.get('wages_number')?.value);
    if (this.projectForm.get('apartment_name')?.value != 'PS') {
      sessionStorage.setItem('apartment_name', this.projectForm.get('apartment_name')?.value);
      sessionStorage.removeItem('appartmentId')
    }
    else
      sessionStorage.removeItem('apartment_name')
    if (this.projectForm.get('floor_number')?.value != 'PS') {
      sessionStorage.setItem('floor_number', this.projectForm.get('floor_number')?.value);
      sessionStorage.removeItem('floorId')
    }
    else
      sessionStorage.removeItem('floor_number')
    if (this.floorids.length > 0) {
      sessionStorage.setItem('floorId', JSON.stringify(this.floorids));
      sessionStorage.removeItem('floor_number')
    }
    else
      sessionStorage.removeItem('floorId')
    if (this.appartmentids.length > 0) {
      sessionStorage.setItem('appartmentId', JSON.stringify(this.appartmentids));
      sessionStorage.removeItem('apartment_name')
    }
    else
      sessionStorage.removeItem('appartmentId')
    this.router.navigateByUrl('/get-wages')
  }

  confirm1(message: any, heading: any) {
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
    if (heading != null) {
      this.message[0] = false
    }
    if (message == 'Please Select Project !' || message == 'Please Select Wages Number !' || message == 'No Wages Found to Download!' || message == "No wages exists to download")
      this.message[0] = true
  }
  accept = () => {
    this.confirmationService.close();
    this.download();
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }
  reject = () => {
    this.confirmationService.close();
  }

  download = () => {
    if (this.projectForm.get('project_name')?.value == 'PS') {
      this.confirm1('Please Select Project !', null);
      return;
    }
    this.service.showloader = true;
    let body = {
      "no_of_records": 10000,
      "page_no": 1,
      "project_id": this.projectForm.get('project_name')?.value,
      // "block_id": this.projectForm.get('block_name')?.value,
      "user_id": sessionStorage.getItem('user_id'),
      "wages_number": this.projectForm.get('wages_number')?.value
      //"apartment_id": this.appartmentids.length == 0 ? this.projectForm.get('apartment_name')?.value : this.appartmentids[0]
    }
    this.service.postRequest("download-wages", body).subscribe(res => {
      if (res.body.code == 1001) {
        this.service.showloader = false;
        this.confirm1(res.body.message, null);
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
        this.message[0] = true;
        this.confirm1(res.body.message, null);
      }
    })
  }

  getDescription = (value: any, type: any, option: any) => {
    this.totalAmount= []
    this.showerror=[]
    this.bookingAmount=[]
    this.percentageAmount = []
    if (option == 'aparment') {
      this.data = [];
      this.totalAmount = '';
      this.selectionType = 'multiple';
      this.projectForm.get('floor_number')?.disable();
      this.projectForm.get('apartment_name')?.disable();
    }
    if (option == 'floor') {
      this.data = [];
      this.selectedFloorType = 'multiple';
      this.projectForm.get('floor_number')?.disable();
      this.projectForm.get('apartment_name')?.disable();
      if(value != 'addWages')
      this.getApartmentData();
    }
    // if (type != 'addWages') {
    //   for (let i = 0; i < this.data.length; i++) {
    //     this.message[i] = false;
    //   }
    // }
    if (this.appartmentids.length == 0 && this.floorids.length == 0) {
      this.selectionType = 'null';
      this.projectForm.get('apartment_name')?.enable();
      // }
      // if (this.appartmentids.length == 0 && this.floorids.length == 0 && !value && option == 'floor') {
      this.selectedFloorType = 'null';
      this.projectForm.get('floor_number')?.enable();
    }
    if (!value || (this.floorids.length == 0))
      return

    this.column = [];
    this.column.push({
      field: 'description_header',
      header: 'Booking Description'
    })
    this.column.push({
      field: 'total',
      header: 'Total Allowance'
    })
    this.column.push({
      field: '',
      header: '% Completed'
    })
    this.column.push({
      field: '',
      header: 'Booking Amount'
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.service.showloader = true;
    let body = {
      "no_of_records": 1000,
      "page_no": 1,
      "project_id": this.projectForm.get('project_name')?.value,
      "block_id": this.projectForm.get('block_name')?.value,
      "apartment_id": this.appartmentids,
      "floor_id": this.floorids
    }

    this.service.postRequest("get-description-work", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.data = res.body.data.description_work_details;
        this.service.showloader = false;
        if (type == 'addWages')
          this.confirm1('Wages Added Successfully !', null);
      }
      else {
        this.service.showloader = false;
        this.message[0] = true;
        this.confirm1(res.body.message, null);
      }
    }
    );
  }

  // setInvervalHit = () =>{
  //   interval((this.stock_hit_time)).subscribe(value => {
  //       if (this.stock_hit_time) {
  //       }
  //     })
  // }

}
