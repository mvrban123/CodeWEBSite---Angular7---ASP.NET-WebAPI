import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CartService } from './shared/cart.service';
import { ItemService } from './shared/item.service';
import { UserService } from './shared/user.service';
import { CookieService } from "ngx-cookie-service";
import { OrderService } from './shared/order.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { PosComponent } from './item/pos/pos.component';
import { ReferenceListComponent } from './reference-list/reference-list.component';
import { SoftwareComponent } from './item/software/software.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserDetailsComponent } from './user-panel/user-details/user-details.component';
import { UserOrdersComponent } from './user-panel/user-orders/user-orders.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UsersComponent, DialogNewUser } from './admin/users/users.component';
import { OrdersComponent, DialogOrder, DialogUploadDocument, DialogChangeStatus } from './admin/orders/orders.component';
import { ItemsComponent, DialogNewItem, DialogStorageAmount } from './admin/items/items.component';
import { CompanyService } from './shared/company.service';
import { ContactService } from './shared/contact.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    HomeComponent,
    ItemComponent,
    PosComponent,
    SoftwareComponent,
    AboutComponent,
    CartComponent,
    MatConfirmDialogComponent,
    UserPanelComponent,
    UserDetailsComponent,
    UserOrdersComponent,
    UsersComponent,
    OrdersComponent,
    ItemsComponent,
    DialogNewUser,
    DialogNewItem,
    DialogOrder,
    DialogStorageAmount,
    DialogUploadDocument,
    DialogChangeStatus,
    ContactComponent,
    ReferenceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    MatDialogModule,
    MatIconModule,
    FormsModule
  ],
  providers: [UserService, 
    ItemService, 
    CartService,
    CompanyService,
    ContactService,
    CookieService, 
    OrderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    MatConfirmDialogComponent,
    DialogNewUser,
    DialogNewItem,
    DialogOrder,
    DialogStorageAmount,
    DialogUploadDocument,
    DialogChangeStatus
  ]
})
export class AppModule { }
