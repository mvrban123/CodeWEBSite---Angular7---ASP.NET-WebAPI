import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  readonly ApiURL = "http://5.189.154.50:52218/api/Item";
  // readonly ApiURL = "http://localhost:52218/api/Item";

  item: Item = new Item();

  constructor(private http: HttpClient)
  {
  }

  // 1 - pos equipment, 2 - software
  getItems(itemTypeId?: any)
  {
    return this.http.get(this.ApiURL + `${itemTypeId ? `/${itemTypeId}` : "" }`).toPromise();
  }

  getItem(itemId: number)
  {
    return this.http.get(this.ApiURL + "/GetItem/" + itemId).toPromise();
  }

  createItem()
  {
    return this.http.post(this.ApiURL, this.item);
  }

  updateItem()
  {
    return this.http.put(this.ApiURL + "/" + this.item.Id, this.item);
  }

  deleteItem(itemId: any)
  {
    return this.http.delete(this.ApiURL + "/" + itemId);
  }
}
