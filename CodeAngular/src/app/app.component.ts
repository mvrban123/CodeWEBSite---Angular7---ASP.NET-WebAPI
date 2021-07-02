import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './shared/cart.service';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeAngular';

  username: string;

  constructor(private router: Router, 
    public cartService: CartService, 
    private userService: UserService) 
  {    
  }

  ngOnInit()
  {
    this.cartService.checkCart();
  }

  checkToken() : boolean
  {
    if(localStorage.getItem('token') != null)
    {
      this.username = localStorage.getItem('username');
      return true;
    }
    else
      return false;
  }

  openCart()
  {
    this.router.navigate(['cart']);
  }

  openUserProfile()
  {
    if(this.userService.getUserRole() == "Admin")
    {
      this.router.navigateByUrl("admin/orders");
      return;
    }

    this.router.navigateByUrl("userpanel/details");
  }

  onLogout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['home']);
  }
}
