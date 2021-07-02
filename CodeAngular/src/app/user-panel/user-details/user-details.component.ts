import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/models/user.model';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/shared/company.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  company: Company = new Company();

  constructor(public userService: UserService,
    private companyService: CompanyService)
  {
  }

  ngOnInit() 
  {
    this.getLoggedUser();
  }
  
  getLoggedUser()
  {
    this.userService.getUser(this.userService.getUserId()).then(
      (res: any) => {
        this.userService.loggedUser = res as User;
        this.getUserCompany(this.userService.loggedUser.Id);
      }
    );
  }

  getUserCompany(userId: string)
  {
    this.companyService.getUserCompany(userId).then(
      (res: Company) => {
        this.company = res;
      }
    );
  }
}
