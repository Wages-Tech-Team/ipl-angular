import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConstructionDetailsComponent } from './construction-details/construction-details.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {MultiSelectModule} from 'primeng/multiselect';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';
import { ConfirmationService } from 'primeng/api';
import { AddPayToComponent } from './add-pay-to/add-pay-to.component';
import { GetWagesComponent } from './get-wages/get-wages.component';
import { DropdownModule } from 'primeng/dropdown';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstructionDetailsComponent,
    MainDashboardComponent,
    SignInComponent,
    SignUpComponent,
    UploadExcelComponent,
    AddPayToComponent,
    GetWagesComponent,
    UserDetailsComponent,
    AddProjectComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule ,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ButtonModule,
    MessagesModule,
    BrowserAnimationsModule,
		MultiSelectModule,
    FormsModule,
    DropdownModule
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
