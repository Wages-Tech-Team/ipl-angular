import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Header, Message, PrimeNGConfig } from 'primeng/api';
import { interval } from 'rxjs';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent implements OnInit {
  filename: any;
  uploadedFile: any;
  projectDetails: any;
  selectedId: any = 'PS';
  msgs: Message[] = [];
  modalHeading: any;
  submitted: boolean = false;
  errorMessage: string = '';
  stock_hit_time: number = 1 * 60 * 1000;
  filePath: any;
  selectPart: boolean= false;
  constructor(private router: Router, public service: CommonService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getProjectId();
  }

  handleFileUpload(event: any) {
    let files = event.target.files;
    this.uploadedFile = files[0]
    this.filename = files[0].name;
  }

  navigatedTo() {
    this.router.navigateByUrl('/main');
  }

  navigatedToPaytoScreen() {
    this.router.navigateByUrl('/add-payto');
  }

  navigatedToProjectManagementScreen() {
    this.router.navigateByUrl('/add-project');
  }

  delete() {
    this.filename = ''
  }

  upload = () => {
    if (!this.uploadedFile)
      return;

    this.service.showloader = true;
    let data = new FormData();
    data.append("request[file]", this.uploadedFile);
    this.service.postRequestForUpload("upload-excel", data).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        // interval((this.stock_hit_time)).subscribe(value => {
        //   if (this.stock_hit_time) {
        //     this.checkUploadProgress();
        //   }
        // })
        // if (!this.stock_hit_time) {
        // }
        this.service.showloader = false;
        this.filePath = res.body.data.file_path;
        this.confirm('Are you sure you want to import the file ?','Import File');
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    })
  }

  importExcel = (file: any) => {
    this.service.showloader = true;
    let body = {
      "file_path": file,
    }
      this.service.postRequest("import-excel-job", body).subscribe((res) => {
        debugger;
        if (res.body.success == true || res.body.code == 1000) {
          // this.service.showloader = false;
          this.getProjectId();
        }
        else {
          this.service.showloader = false;
          this.confirm(res.body.message, 'Error');
        }
      }
      )
   
  }

  getProjectId = () => {
    this.service.showloader = true;
    let body = {
      "no_of_records": 100,
      "page_no": 1,
      "user_id": sessionStorage.getItem('user_id'),
    }
    this.service.postRequest("get-project-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.projectDetails = res.body.data.project_details;
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    }
    )
  }

  checkUploadProgress = () => {
    this.service.showloader = true;
    let body = {}
    this.service.postRequest("get-expot-excel-progress", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        if (res.body.data.progress.completed) {
          this.stock_hit_time = 0
        }
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    }
    )
  }

  // getPart(part : any){
  //   this.downloadPart = part;
  // }


  confirm(message: any, heading: any) {
    this.modalHeading = heading;
    if ((this.modalHeading == 'Delete Project' || this.modalHeading == 'Download Project') && this.selectedId == 'PS') {
      this.submitted = true;
      return
    }
    if (!this.filename && this.modalHeading == 'Upload Project') {
      this.errorMessage = "Please Upload the file."
      return
    }
    // if(!this.downloadPart && this.modalHeading == 'Download Project'){
    //   this.selectPart = true;
    //   return;
    // }
    else{
      this.selectPart = false
    }
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }

  accept = () => {
    this.confirmationService.close();
    if (this.modalHeading == 'Delete Project') {
      this.deleteProject();
    }
    if (this.modalHeading == 'Download Project') {
      this.downloadProject();
    }
    if (this.modalHeading == 'Upload Project') {
      this.upload();
    }
    if(this.modalHeading == 'Import File')
    this.importExcel(this.filePath);
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }
  reject = () => {
    this.confirmationService.close();
  }

  deleteProject = () => {
    if (this.selectedId == 'PS') {
      this.submitted = true;
      return;
    }
    this.service.showloader = true;
    let body = {
      "project_id": this.selectedId
    }
    this.service.postRequest("delete-project", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.service.showloader = false;
        this.getProjectId();
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    }
    )
  }

  setProjectId(event: any) {
    this.selectedId = ''
    event = event.target.value;
    this.selectedId = event;
  }

  downloadProject = () => {
    if (this.selectedId == 'PS') {
      this.submitted = true;
      return;
    }
    // if(!this.downloadPart){
    //   this.selectPart = true;
    //   return;
    // }
    this.service.showloader = true;
    let body = {
      "project_id": this.selectedId
      // "part": this.downloadPart
    }
    this.service.postRequest("download-construction-details", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        let link = document.createElement('a');
        let url = res.body.data.download_url;
        link.setAttribute('href', url);
        link.setAttribute('download', 'Project' + '.xlsx');
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.service.showloader = false;
      }
      else {
        this.service.showloader = false;
        this.confirm(res.body.message, 'Error');
      }
    }
    )
  }

}
