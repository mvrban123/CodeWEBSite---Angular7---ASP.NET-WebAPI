import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{  
  constructor(private router: Router, private userService: UserService) 
  {
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean
  {
    if(localStorage.getItem('token') != null)
    {
      let roles = route.data['permittedRoles'] as Array<string>;
      if(roles)
      {
        if(this.userService.roleMatch(roles))
          return true;
        else
          this.router.navigate(['home']);
      }
      return true;
    }
    else
    {
      this.router.navigate(['login'])
      return false;
    }
  }
 }
