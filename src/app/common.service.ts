import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BaseServiceService } from './base-service.service';
import { map, catchError , retry} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseServiceService {
  showloader: boolean = false;
  emailPattern: RegExp = /^[\w-]+(\.[\w-]+)*@([A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*?\.[A-Za-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
  password: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  //baseUrl = "https://ipl-wages.com/api/";
  authToken: any;
  // for Stg
  baseUrl = "https://ipl-wages.com/stg.ipl-wages.com/api/"

  public postRequest(url: any, baseRequest: Object): Observable<any> {
    const header: HttpHeaders = new HttpHeaders((url == 'register' || url == 'login') ? { 'ClientVersion': 'WEB:1' } : { 'authorization': "Bearer " + this.getToken() });
    const body = { request: baseRequest };
    return super
        .makePostRequest(this.baseUrl + url, body, header)
        .pipe(
          retry(0),
          catchError( (error: HttpErrorResponse) => {
            this.showloader = false;
            return throwError(
               alert(`Something Went Wrong. The server is temporarily unable to service your request due to some technical problems. Please try again later or contact to website manager.`)
            );
          })
        );
  }

  public getRequest(url: any): Observable<any> {
    const header: HttpHeaders = new HttpHeaders( { 'authorization': "Bearer " + this.getToken() });
    return super
      .makegetRequest(this.baseUrl + url, header)
  }

  public postRequestForUpload(url: any, baseRequest: Object): Observable<any> {
    const header: HttpHeaders = new HttpHeaders((url == 'register' || url == 'login') ? { 'ClientVersion': 'WEB:1' } : { 'authorization': "Bearer " + this.getToken() });
    const body =  baseRequest ;
    return super
      .makePostRequest(this.baseUrl + url, body, header)
  }

  setToken(token: any) {
    sessionStorage.setItem("token",token);
  }

  getToken() {
    return sessionStorage.getItem("token");
  }

  setRole(role: any) {
    sessionStorage.setItem("role",role);
  }

  getRole() {
    return sessionStorage.getItem("role");
  }

  formatNumber(num : any) {
    if (!num)
      return;
    if (String(num).includes('.')) {
      let seperator = String(num).split('.');
      let maskedNumber = String(seperator[0]).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return maskedNumber + '.' + seperator[1];
    }
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  
  dateToUTC(value: any) {
    let date = new Date(value);
    if (date) {
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
    }
    return null;
  }

}
