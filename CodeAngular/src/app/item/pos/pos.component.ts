import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/models/item.model';
import { CartService } from 'src/app/shared/cart.service';
import { UserService } from 'src/app/shared/user.service';
import { CartItem } from 'src/app/models/cart-item.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit { 

  items: CartItem[] = [];

  constructor(private itemService: ItemService, 
    private toastr: ToastrService,
    public userService: UserService,
    private cartService: CartService)
  { 
  }
  
  ngOnInit() 
  {
    this.itemService.getItems(1).then(
      (res: any) => {
        res.forEach((element: Item) => {
          let cartItem = new CartItem();
          cartItem.Amount = 1;
          cartItem.Item = element;
          this.items.push(cartItem);
        });
      }
    );
  }

  checkInput(event: any, item: CartItem)
  {
    item.Amount = event.target.value as number;
  }
  
  addToCart(item: CartItem)
  {
    if(item.Amount == 0 || item.Amount == null)
      return;
    
    this.cartService.addItemToCart(item);
  }

  increaseAmount(item: CartItem) {
    var index = this.findItemIndex(item);
    if(index > -1)
        this.items[index].Amount++;
  }

  decreaseAmount(item: CartItem)
  {
    var index = this.findItemIndex(item);
    if(index > -1)
    {
      if(this.items[index].Amount > 1)
        this.items[index].Amount--;
    }
  }

  findItemIndex(item: CartItem)
  {
    var result = this.items.find(it => it.Item.Id == item.Item.Id);
    if(result)
    {
      var index = this.items.indexOf(result);
      return index;
    } 
    return -1;
  }
}
