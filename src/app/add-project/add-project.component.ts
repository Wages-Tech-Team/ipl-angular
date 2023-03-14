import { Component, OnInit } from '@angular/core';
import { ConfirmationService,PrimeNGConfig } from 'primeng/api';
import { Column } from 'src/column.model';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  column: Array<Column> = new Array<Column>();
  nestedcolumns: Array<Column> = new Array<Column>();
  data: any = [];
  first = 0;
  totalRecords = 0;
  selectedRowIndex: number = 0;
  projectDetails: any;
  projectId: any = "PS";
  msgs: any;
  userId: any;
  operation: any;
  projectInfo: any;

  constructor(public service: CommonService, private primengConfig: PrimeNGConfig, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.service.showloader = true;
    this.column.push({
      field: 'user_name',
      header: 'User Name'
    }),
      this.column.push({
        field: 'user_role',
        header: 'User role'
      })
    this.column.push({
      field: '',
      header: ''
    })
    this.column.push({
      field: '',
      header: ''
    })
    this.getUserProjectDetails();
    this.getProjectDetails();
    this.primengConfig.ripple = true;
  }

  getUserProjectDetails = () => {
    let body = {
      "no_of_records": 10000,
      "page_no": "1"
    }
    this.service.postRequest("get-user-projects", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.data = res.body.data.user_list;
        this.service.showloader = false;
      }
      else{
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null,null,null);
      }
    });
  }

  getProjectDetails = () => {
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
      else{
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null,null,null);
      }
    })
  }

  selectedRow(index: number) {
    this.selectedRowIndex = index;
    this.nestedcolumns = []
    this.nestedcolumns.push(
      { field: 'project_name', header: 'Project Name' },
    )
  }

  changeProjectName(event: any) {
    this.projectId = event.target.value;
  }


  addProject() {
    this.service.showloader = true;
    let body = {
      "user_id": this.userId,
      "operation": this.operation,
      "project_id": this.operation == 'add'? this.projectId : this.projectInfo
    }
    this.service.postRequest("link-user-project", body).subscribe(res => {
      if (res.body.success == true || res.body.code == 1000) {
        this.getUserProjectDetails();
        this.projectId = "PS"
      }
      else{
        this.service.showloader = false;
        this.confirm(res.body.message,'Error',null,null,null);
      }
    })
  }

  reject = () => {
    this.confirmationService.close();
  }

  accept = () => {
    this.confirmationService.close();
    this.addProject();
    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
  }

  confirm(message: any, heading: any, index: any, id: any, info: any) {
    if(heading == "Add Project" && this.projectId == "PS"){
      message = "Please Select Project";
      heading = "Error";
    }
    this.userId = id;
    this.operation = heading == "Add Project" ? "add" : (heading == "Remove Project") ? "remove":"null";
    this.projectInfo = info
    this.confirmationService.confirm({
      message: message,
      header: heading,
    });
  }

}
