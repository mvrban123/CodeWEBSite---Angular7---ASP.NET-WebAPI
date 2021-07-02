import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Order, OrderItem } from '../models/order.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { stringify } from '@angular/compiler/src/util';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly ApiURL = "http://5.189.154.50:52218/api/Order"
  // readonly ApiURL = "http://localhost:52218/api/Order";

  constructor(private cartService: CartService, private http: HttpClient, private userService: UserService)
  {
  }

  createOrder(delivery)
  {
    let order = new Order();
    order.OrderDate = new Date();
    
    order.UserId = this.userService.getUserId();
    order.StatusId = 1;
    order.Delivery = delivery;

    let orderItems: OrderItem[] = [];
    this.cartService.cartItems.forEach(element => {
      let orderItem = new OrderItem();
      orderItem.Amount = element.Amount;
      orderItem.ItemId = element.Item.Id;
      orderItems.push(orderItem);
    });

    order.OrderItems = orderItems;

    return this.http.post(this.ApiURL, order);
  }

  getOrders(userId? : any)
  {
    return this.http.get(this.ApiURL + `${userId ? `/${userId}` : ''}`);
  }

  getOrderItems(orderId: number)
  {
    return this.http.get(this.ApiURL + "/OrderItems/" + orderId);
  }

  updateOrderStatus(orderId: string, statusId: string)
  {
    let changeStatusModel = {
      OrderId: orderId,
      StatusId: statusId
    }

    return this.http.put(this.ApiURL + "/OrderStatus", changeStatusModel);
  }

  removeOrder(orderId: number)
  {
    return this.http.delete(this.ApiURL + "/" + orderId);
  }

  uploadFile(orderId: number, documentType: number, file: File)
  {
    const formData = new FormData();
    formData.append('file', file, file.name);

    let document: string;
    if(documentType == 1)
      document = "Invoice";
    else if(documentType == 2)
      document = "Warranty";

    return this.http.post(this.ApiURL + "/UploadFile/" + orderId + "/" + `${document}`, formData);
  }

  async downloadFile(order: Order, document: string)
  {
    const options = { responseType: 'blob' as 'json'}
    return this.http.get<Blob>(this.ApiURL + "/DownloadFile/" + order.Id + "/" + document, options).toPromise().then(
      res => {
        var blob = new Blob([res], { type: "application/pdf" });

        var array: string[] = [];
        if(document == "Invoice")
          array = order.InvoiceLocation.split('\\');
        else if(document == "Warranty")
          array = order.WarrantyLocation.split('\\');

        var fileName = array[2].substring(0, array[2].length - 4);
        saveAs(blob, fileName);
      }
    )
  }
}
