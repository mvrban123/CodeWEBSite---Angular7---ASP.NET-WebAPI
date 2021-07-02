import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserType } from 'src/app/models/user-type.model';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/shared/company.service';
import { Order } from 'src/app/models/order.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  company: Company;

  constructor(private userService: UserService, 
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
    private companyService: CompanyService)
  {
  }

  ngOnInit() 
  {
    this.getUsers();
  }

  getUsers()
  {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res as User[];
        this.users.forEach(element => {
          // Get user company
          this.companyService.getUserCompany(element.Id).then(
            response => {
              element.Company = response as Company;
            }
          );
          // Get user role
          this.userService.getSelectedUserRole(element.Id).subscribe(
            (res: any) => {
              element.Role = res.Name;
            }
          );
        });
      }
    );
  }

  getCompany(user: User)
  {
    this.companyService.getUserCompany(user.Id)
  }

  openDialog(user?: User)
  {
    const dialogRef = this.dialog.open(DialogNewUser, {
      width:'80%',
      height: '90%',
      data: {
        selectedUser: user != null ? user : null
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.getUsers();
      }
    );
  }

  deleteUser(userId: any)
  {
    this.dialogService.openConfirmDialog("Jeste li sigurni da želite obrisati odabranog korisnika?").afterClosed().subscribe(
      res => {
        if(res)
        {
          this.userService.removeUser(userId).subscribe(
            res => {
              this.toastr.info("Korisniko je uspješno obrisan.", "Info");
              this.getUsers();
            }
          );
        }
      }
    );
  }
}

@Component({
  selector: 'dialog-new-user',
  templateUrl: 'dialog-new-user.html',
  styleUrls: ['dialog-new-user.css']
})
export class DialogNewUser implements OnInit {

  user: User = null;
  userRole: string;
  company: Company = null;
  formModel: FormGroup;
  companyInfoModel: FormGroup;

  userTypes = [
    new UserType(1, 'Admin'),
    new UserType(2, 'B2B Partner')
  ];

  constructor(public dialogRef: MatDialogRef<DialogNewUser>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) 
  {
  }
  
  ngOnInit()
  {
    if(this.data.selectedUser != null)
      this.user = this.data.selectedUser;

    this.formModel = this.formBuilder.group({
      UserInfo: this.formBuilder.group({
        FirstName: [this.user != null ? this.user.FirstName : '', Validators.required],
        Surname: [this.user != null ? this.user.Surname : '', Validators.required],
        UserName: [this.user != null ? this.user.UserName : '', [Validators.required, Validators.minLength(3)]],
        Role: [this.user != null ? this.user.Role : null, Validators.required],
        Email: [this.user != null ? this.user.Email : '', [Validators.required, Validators.email]],
        Password: ['', this.user != null ? null : [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ['', this.user != null ? null : [Validators.required]]
      }),
      CompanyInfo: this.formBuilder.group({
        CompanyName: [this.user != null ? this.user.Company.Name : '', Validators.required],
        Oib: [this.user != null ? this.user.Company.Oib : '', [Validators.required, Validators.minLength(11)]],
        Address: [this.user != null ? this.user.Company.Address : '', Validators.required],
        PostalNumber: [this.user != null ? this.user.Company.PostalNumber : '', Validators.required],
        City: [this.user != null ? this.user.Company.City : '', Validators.required]
      })
    });
  }
  
  onSubmit()
  {
    if(this.user == null)
      this.createNewUser();
    else
      this.editUser();
  }
  
  createNewUser()
  {
      this.userService.createUser(this.formModel).subscribe(
        res => {
          this.dialogRef.close();
          this.toastr.info('Novi korisnik je uspješno kreiran.', 'Info');
        },
        err => {
          this.toastr.error('Kreiranje novog korisnika nije uspjelo.', 'Greška');
        }
      );
  }

  editUser()
  {
    this.userService.updateUser(this.user.Id, this.formModel.value).subscribe(
      res => {
        this.dialogRef.close();
        this.toastr.info('Korisnik je uspješno ažuriran.', 'Info');
      },
      err => {
        this.toastr.error('Uređivanje korisnika nije uspjelo', 'Greška');
      }
    );
  }
}
