import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPayToComponent } from './add-pay-to/add-pay-to.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ConstructionDetailsComponent } from './construction-details/construction-details.component';
import { GetWagesComponent } from './get-wages/get-wages.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {path: 'main', component: MainDashboardComponent},
  {path: 'construction-details', component: ConstructionDetailsComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'upload-excel', component: UploadExcelComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'add-payto', component: AddPayToComponent},
  {path: 'get-wages', component: GetWagesComponent},
  {path: 'get-user-details', component: UserDetailsComponent},
  {path: 'add-project', component: AddProjectComponent},
  {path: '**', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
