import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Order, OrderItem } from 'src/app/models/order.model';
import { OrderService } from 'src/app/shared/order.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/models/user.model';
import { Status } from 'src/app/models/status.model';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/shared/company.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  constructor(private orderService: OrderService,
    private dialog: MatDialog)
  {
  }

  ngOnInit() 
  {
    this.getOrders();
  }

  getOrders()
  {
    this.orderService.getOrders().subscribe(
      res => {
        this.orders = res as Order[];
        this.filteredOrders = res as Order[];
      }
    );
  }

  selectedStatusChange(value: number) {
    if(value == 0)
    {
      this.filteredOrders = this.orders;
      return;
    }
    this.filteredOrders = this.orders.filter(it => it.StatusId == value);
  }

  openOrder(order: Order)
  {
    let dialogRef = this.dialog.open(DialogOrder, {
      width: '70%',
      height: '80%',
      data: {
        selectedOrder: order,
        adminPanel: true,
        downloadPdf: false
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.getOrders();
      }
    );
  }

  openFileUploadDialog(orderId: number)
  {
    let dialogRef = this.dialog.open(DialogUploadDocument, {
      width: '400px',
      height: '260px',
      data: {
        orderId: orderId
      }
    });
  }

  openChangeStatusDialog(order) {
    let dialogRef = this.dialog.open(DialogChangeStatus, {
      width: '400px',
      height: '175px',
      data: {
        order: order
      }
    });

    dialogRef.afterClosed().subscribe(
      () => {
        this.getOrders();
      }
    );
  }
}

@Component({
  selector: 'dialog-order',
  templateUrl: 'dialog-order.component.html',
  styleUrls: ['dialog-order.component.css']
})
export class DialogOrder implements OnInit {

  @ViewChild('content', null) content: ElementRef;
  @ViewChild('order', null) orderElement: ElementRef;

  adminPanel: boolean;
  order: Order = null;
  company: Company = null;
  orderStatusId: any;
  totalAmount = 0;

  statusList = [
    new Status(1, "Na čekanju"),
    new Status(2, "U obradi"),
    new Status(3, "Spremno za isporuku")
  ];

  constructor(private dialogRef: MatDialogRef<DialogOrder>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private orderService: OrderService,
    public companyService: CompanyService)
  {
  }

  ngOnInit()
  {
    this.order = this.data.selectedOrder as Order;
    this.adminPanel = this.data.adminPanel;
    if(this.order != null)
    {
      this.getOrderItems(this.order.Id);
      this.orderStatusId = this.order.StatusId;
      this.companyService.getUserCompany(this.order.UserId);
      setTimeout(() => {
        this.generatePDF();
      }, 2000);
    }
  }

  getOrderItems(orderId: number)
  {
    this.orderService.getOrderItems(orderId).subscribe(
      (res: any) => {
        this.order.OrderItems = res as OrderItem[];
        this.calculateTotal();
      }
    );
  }

  calculateTotal()
  {
    if(this.order != null)
    {
      this.order.OrderItems.forEach(element => {
        this.totalAmount += element.Amount * element.Item.Price;
      });
    }
  }

  onStatusChange()
  {
    this.orderService.updateOrderStatus(String(this.order.Id), this.orderStatusId).subscribe(
      res => {
        // ??? dela
      }
    );
  }

  generatePDF()
  {
    if(this.data.downloadPdf)
    {
      html2canvas(this.content.nativeElement, { scale: 4 }).then(function(canvas) {
        var pdf = new jsPDF('p','pt','a4');
          pdf.addImage(canvas.toDataURL("image/jpeg"),"jpeg", 10, 10, 575, 842);
          pdf.save("proba.pdf");
      });
    }
  }
}

@Component({
  selector: 'dialog-upload-document',
  templateUrl: 'dialog-upload-document.html',
  styleUrls: ['dialog-upload-document.css']
})
export class DialogUploadDocument implements OnInit
{
  documentType : number = 1;
  fileToUpload: File = null;

  constructor(private dialogRef: MatDialogRef<DialogUploadDocument>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private orderService: OrderService,
    private toastr: ToastrService)
  {
  }

  ngOnInit()
  {
  }

  handleFileInput(files: FileList)
  {
    this.fileToUpload = <File>files.item(0);
  }

  changeDocumentType(value: number)
  {
    this.documentType = value;
  }
  
  uploadFile()
  {
    this.orderService.uploadFile(this.data.orderId, this.documentType, this.fileToUpload).subscribe(
      res => {
        let document: string;
        if(this.documentType == 1)
          document = "Račun";
        else if(this.documentType == 2)
          document = "Jamstveni list";

        this.toastr.info(`${document} je uspješno učitan.`, "Info");
      }
    )
  }
}

@Component({
  selector: 'dialog-change-status',
  templateUrl: 'dialog-change-status.html',
  styleUrls: ['dialog-change-status.css']
})
export class DialogChangeStatus implements OnInit
{
  order: Order;
  status: string;

  constructor(private dialogRef: MatDialogRef<DialogChangeStatus>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private orderService: OrderService)
  {
  }

  ngOnInit() {
    this.order = this.data.order;
    this.status = this.data.order.StatusId;
  }

  changeStatus(value: string) {
    this.status = value;
  }

  saveStatus() {
    this.orderService.updateOrderStatus(String(this.order.Id), this.status).subscribe(
      res => {
        this.dialogRef.close();
      }
    );
  }
}