import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Item } from '../models/item.model';
import { CartItem } from '../models/cart-item.model';
import { IfStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  hasOutOfStock: boolean = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  itemCount = 0;

  constructor(private cookieService: CookieService,
    private itemService: ItemService,
    private toastr: ToastrService)
  { 
  }

  checkCart()
  {
    if(this.cookieService.check('cart'))
    {
      this.cartItems = JSON.parse(this.cookieService.get('cart')) as CartItem[];
      // Check storage amount
      if(this.cartItems.length > 0)
      {
        this.cartItems.forEach((element: CartItem) => {
          this.itemService.getItem(element.Item.Id).then(
            (res: any) => {
              if(res.StorageAmount != element.Item.StorageAmount)
                element.Item.StorageAmount = res.StorageAmount;
            }
          );
        });
      }

      this.checkIfContainsOutOfStock();
    }
    else
      this.cartItems = [];

    if(this.cookieService.check('cart-item-count'))
      this.itemCount = Number(this.cookieService.get('cart-item-count'));
    else
      this.itemCount = 0;
  }

  calculateTotalPrice()
  {
    var total = 0;
    this.cartItems.forEach(element => {
      total += element.Item.Price * element.Amount;
      this.totalPrice = total;
    });
  }

  addItemToCart(item: CartItem)
  {
    var index = this.findCartItem(item.Item);
    
    if(index > -1)
      this.cartItems[index].Amount += item.Amount;
    else
    {
      let cartItem = new CartItem();
      cartItem.Amount = item.Amount;
      cartItem.Item = item.Item;
      this.cartItems.push(cartItem);
    }

    this.toastr.info(`Proizvod ${item.Item.Name} je dodan u košaricu.`, "Info");
    this.itemCount += Number(item.Amount);
    this.updateCartCookies();
  }

  setItemAmount(item: CartItem)
  {
    var index = this.findCartItem(item.Item);

    if(index > -1)
    {
      
      if(item.Amount == 0 || item.Amount == null)
      {
        this.calculateDifference(1, index);
        return;
      }
      
      this.calculateDifference(item.Amount, index);
    }
  }

  calculateDifference(itemAmount: number, index: number)
  {
    var difference: number = itemAmount - this.cartItems[index].Amount;
    this.itemCount += difference;
    this.cartItems[index].Amount = itemAmount;
    this.updateCart();
  }

  decreaseItemAmount(item: Item, event)
  {
    var index = this.findCartItem(item);
    if(index > -1)
    {
      if(this.cartItems[index].Amount > 1)
      {
        this.cartItems[index].Amount--;
        this.itemCount--;

        if(this.cartItems[index].Amount <= item.StorageAmount)
          event.target.classList.remove('out-of-stock');
      }
      this.updateCart();
    }
  }

  increaseItemAmount(item: Item)
  {
    var index = this.findCartItem(item);
    if(index > -1)
    {
      this.cartItems[index].Amount++;
      this.itemCount++;
      this.updateCart();
    }
  }

  removeItemFromCart(item: Item)
  {
    var index = this.findCartItem(item);
    if(index > -1)
    {
      this.itemCount -= this.cartItems[index].Amount;
      this.cartItems.splice(index, 1);
      this.updateCart();
    }
  }

  findCartItem(item: Item) : number
  {
    var check = this.cartItems.find(it => it.Item.Id === item.Id);
    if(check)
    {
      var index = this.cartItems.indexOf(check);
      return index;
    }
    return -1;
  }

  updateCart()
  {
    this.updateCartCookies();
    this.checkIfContainsOutOfStock();

    if(this.cartItems.length == 0)
      window.location.reload();
    else
      this.calculateTotalPrice();
  }

  updateCartCookies()
  {
    this.cookieService.set('cart', JSON.stringify(this.cartItems), 1);
    this.cookieService.set('cart-item-count', String(this.itemCount), 1);
  }

  deleteCartCookies()
  {
    this.cookieService.delete('cart');
    this.cookieService.delete('cart-item-count');
  }

  checkIfContainsOutOfStock()
  {
    var check = function(element: CartItem) {
      return element.Amount > element.Item.StorageAmount && element.Item.ItemTypeId == 1;
    }
    this.hasOutOfStock = this.cartItems.some(check);
  }
}
