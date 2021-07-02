import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { UserService } from 'src/app/shared/user.service';
import { Order } from 'src/app/models/order.model';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { DialogOrder } from 'src/app/admin/orders/orders.component';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  userOrders: Order[] = [];

  constructor(private orderService: OrderService, 
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private toastr: ToastrService,
    private dialog: MatDialog)
  {
  }

  ngOnInit()
  {
    this.getUserOrders();
  }

  getUserOrders()
  {
    this.orderService.getOrders(this.userService.getUserId()).subscribe(
      (res: any) => {
        this.userOrders = res as Order[];
      }
    );
  }

  openOrderDialog(order: Order, pdf: boolean)
  {
    const dialogRef = this.dialog.open(DialogOrder, {
      width: '595px',
      height: '842px',
      data: {
        selectedOrder: order,
        adminPanel: false,
        downloadPdf: pdf
      }
    });
  }

  deleteOrder(orderId: number)
  {
    this.confirmDialog.openConfirmDialog("Jeste li sigurni da želite odustati od odabrane narudžbe?").afterClosed().subscribe(
      res => {
        if(res)
        {
          this.orderService.removeOrder(orderId).subscribe(
            res => {
              this.toastr.info("Narudžba je uspješno obrisana.", "Info");
              this.getUserOrders();
            }
          );
        }
      }
    );
  }

  downloadFile(order: Order, document: string)
  {
    this.orderService.downloadFile(order, document);
  }
}
