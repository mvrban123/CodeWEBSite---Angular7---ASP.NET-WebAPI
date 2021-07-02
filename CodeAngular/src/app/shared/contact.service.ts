import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  readonly ApiURL = "http://5.189.154.50:52218/api/Contact";
  // readonly ApiURL = "http://localhost:52218/api/Contact";

  constructor(private http: HttpClient) 
  {
  }

  sendMessage(model: any)
  {
    return this.http.post(this.ApiURL + "/SendMessage", model);
  }
}
