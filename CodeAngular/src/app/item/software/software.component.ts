import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { CartService } from 'src/app/shared/cart.service';
import { Item } from 'src/app/models/item.model';
import { UserService } from 'src/app/shared/user.service';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  items: CartItem[] = [];

  constructor(private itemService: ItemService, 
    private cartService: CartService,
    public userService: UserService)
  {
  }

  ngOnInit() 
  {
    this.itemService.getItems(2).then(
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
