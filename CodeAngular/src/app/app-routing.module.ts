import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ItemComponent } from './item/item.component';
import { PosComponent } from './item/pos/pos.component';
import { SoftwareComponent } from './item/software/software.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserDetailsComponent } from './user-panel/user-details/user-details.component';
import { UserOrdersComponent } from './user-panel/user-orders/user-orders.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ItemsComponent } from './admin/items/items.component';
import { UsersComponent } from './admin/users/users.component';
import { ContactComponent } from './contact/contact.component';
import { ReferenceListComponent } from './reference-list/reference-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin']}, children: [
    { path: 'items', component: ItemsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'users', component: UsersComponent }
  ] },
  { path: 'item', component: ItemComponent, children: [
    { path: 'pos', component: PosComponent },
    { path: 'software', component: SoftwareComponent }
  ] },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'userpanel', component: UserPanelComponent, canActivate: [AuthGuard], children: [
    { path: 'details', component: UserDetailsComponent },
    { path: 'orders', component: UserOrdersComponent }
  ]},
  { path: 'references', component: ReferenceListComponent },
  { path: 'contact', component: ContactComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
