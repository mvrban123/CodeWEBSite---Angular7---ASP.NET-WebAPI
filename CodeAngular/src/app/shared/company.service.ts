import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  readonly ApiURL = "http://5.189.154.50:52218/api/Company";
  // readonly ApiURL = "http://localhost:52218/api/Company";

  company: Company = new Company();

  constructor(private http: HttpClient) 
  {
  }

  async getUserCompany(userId: string)
  {
    const response = await this.http.get(this.ApiURL + "/" + userId).toPromise();
    this.company = response as Company
    return response;
  }
}
