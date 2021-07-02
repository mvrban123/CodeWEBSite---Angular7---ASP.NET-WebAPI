import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly ApiURL = "http://5.189.154.50:52218/api/User";
  // readonly ApiURL = "http://localhost:52218/api/User";

  user = new User();
  loggedUser = new User();

  constructor(private http: HttpClient)
  {
  }

  checkToken()
  {
    return localStorage.getItem('token') != null;
  }

  // User login
  login(loginModel)
  {
    return this.http.post(this.ApiURL + "/Login", loginModel);
  }

  // Used to create new user - Note: only admin should have access to this option
  createUser(formValue: FormGroup)
  {
    let userModel = formValue.get('UserInfo').value;
    let companyModel = formValue.get('CompanyInfo').value;
    let model = {
      UserInfo: userModel,
      CompanyInfo: companyModel
    };

    return this.http.post(this.ApiURL + "/Register", model);
  }

  updateUser(userId: string, userModel: any)
  {
    return this.http.put(this.ApiURL + "/" + userId, userModel);
  }

  getUsers()
  {
    return this.http.get(this.ApiURL);
  }

  getUser(userId: string)
  {
    return this.http.get(this.ApiURL + "/" + userId).toPromise();
  }

  getPayload()
  {
    if(localStorage.getItem('token'))
      return JSON.parse(window.atob(localStorage.getItem('token').split(".")[1]));
  }

  getUserId()
  {
    return this.getPayload().UserID;
  }

  getUserRole()
  {
    return this.getPayload().role;
  }

  roleMatch(allowedRoles: any): boolean
  {
    var result = false;
    var userRole = JSON.parse(window.atob(localStorage.getItem('token').split(".")[1])).role;
    allowedRoles.forEach((element: any) => {
      if(userRole == element) {
        result = true;
      }
    });
    return result;
  }

  getSelectedUserRole(userId: any)
  {
    return this.http.get(this.ApiURL + "/UserRole/" + userId);
  }

  removeUser(userId: any)
  {
    return this.http.delete(this.ApiURL + "/" + userId);
  }
}
