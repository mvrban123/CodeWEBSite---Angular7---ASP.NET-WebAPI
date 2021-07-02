import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private toastr: ToastrService, private router: Router)
  {
  }

  ngOnInit() 
  {
    if(localStorage.getItem('token') != null)
      this.router.navigate(['home']);
  }

  formModel = this.formBuilder.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  onSubmit()
  {
    this.userService.login(this.formModel.value).subscribe(
      (res:any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        this.router.navigate(['home']);
      },
      err => {
        if(err.status == 400)
          this.toastr.error("Prijava nije uspjela.", "Greška");
      }
    );
  }
}
