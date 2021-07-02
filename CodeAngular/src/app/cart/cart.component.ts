import { Component, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { ConfirmDialogService } from '../shared/confirm-dialog.service';
import { Item } from '../models/item.model';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { CartItem } from '../models/cart-item.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  delivery = false;
  
  constructor(public cartService: CartService, 
    private orderService: OrderService, 
    private dialogService: ConfirmDialogService,
    private router: Router,
    private toastr: ToastrService) 
  {
  }

  ngOnInit() 
  {
    this.cartService.checkCart();
    this.cartService.calculateTotalPrice();
  }

  setAmount(event, item: CartItem)
  {
    let copy = Object.assign({}, item);
    copy.Amount = event.target.value;
    this.cartService.setItemAmount(copy);
  }

  cartItemDecrease(item: Item, event)
  {
    this.cartService.decreaseItemAmount(item, event);
  }

  cartItemIncrease(item: Item)
  {
    this.cartService.increaseItemAmount(item);
  }

  removeItem(item: Item)
  {
    this.dialogService.openConfirmDialog("Jeste li sigurni za želite obrisati proizvod iz košarice?").afterClosed().subscribe(
      res => {
        if(res)
          this.cartService.removeItemFromCart(item);
      }
    );
  }

  sendOrder()
  {
    this.orderService.createOrder(this.delivery).subscribe(
      res => {
        this.cartService.deleteCartCookies();
        this.cartService.checkCart();
        this.router.navigateByUrl("/userpanel/orders");
        this.toastr.info("Nova narudžba je uspješno kreirana!", "Info");
      }
    );
  }
}
