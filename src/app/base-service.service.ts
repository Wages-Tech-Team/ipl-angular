import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract  class BaseServiceService {
  private _http: HttpClient;
  constructor( private http: HttpClient) {
    this._http = http;
   }

  protected makePostRequest(url : any, body: any, headers: HttpHeaders) {
    const httpOptions = { headers: headers, withCredentials: false };
    return this.http.post(url, body, { headers: httpOptions.headers, observe: 'response' });
  }
  protected makegetRequest(url : any, headers: HttpHeaders) {
    var fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = url;
    }

    const httpOptions = {headers: headers, withCredentials: true};
    return this._http.get(fullUrl, {headers:httpOptions.headers,observe:'response'});
  }
}
