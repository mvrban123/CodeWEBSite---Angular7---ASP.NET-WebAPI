import { Component, OnInit, Inject } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ItemType } from 'src/app/models/item-type.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];

  constructor(private itemService: ItemService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogService: ConfirmDialogService) 
  {
  }

  ngOnInit() 
  {
    this.getItems();
  }

  getItems()
  {
    this.itemService.getItems().then(
      (res: any) => {
        this.items = res as Item[];
      }
    )
  }

  getAmount(item: Item)
  {
    return item.StorageAmount > 0 ? item.StorageAmount : "-";
  }

  itemStorageAmount(item: Item)
  {
    let dialogRef = this.dialog.open(DialogStorageAmount, {
      width: '300px',
      height: '340px',
      data: {
        selectedItem: item
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.getItems();
      }
    );
  }

  openItemDialog(item?: Item)
  {
    this.itemService.item = item;
    let dialogRef = this.dialog.open(DialogNewItem, {
      width: '450px',
      height: '605px',
      data: {
        selectedItem: item
      }
    })

    dialogRef.afterClosed().subscribe(
      res => {
        this.getItems();
      }
    )
  }
  
  deleteItem(itemId: any)
  {
    this.dialogService.openConfirmDialog("Jeste li sigurni za želite obrisati ovaj proizvod?").afterClosed().subscribe(
      res => {
        if(res)
        {
          this.itemService.deleteItem(itemId).subscribe(
            res => {
              this.toastr.info('Proizvod je uspješno obrisan.', 'Info');
              this.getItems();
            }
          );
        }
      }
    );
  }
}

@Component({
  selector: 'dialog-new-item',
  templateUrl: 'dialog-new-item.html',
  styleUrls: ['dialog-new-item.css']
})
export class DialogNewItem implements OnInit {

  item: Item = null;
  formModel: FormGroup;
  
  itemTypes = [
    new ItemType(1, "Printer"),
    new ItemType(2, "Software"),
    new ItemType(3, "All In One")
  ];
  
  constructor(public dialogRef: MatDialogRef<DialogNewItem>,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
    }
    
  ngOnInit()
  {
    if(this.data.selectedItem != null)
      this.item = this.data.selectedItem;

    this.formModel = this.formBuilder.group({
      Id: [(this.item != null ? this.item.Id : 0)],
      Name: [(this.item != null ? this.item.Name : ''), Validators.required],
      ItemTypeId: [(this.item != null ? this.item.ItemTypeId : null), Validators.required],
      Price: [(this.item != null ? this.item.Price : 100), Validators.required],
      Image: [null],
      Description: [(this.item != null ? this.item.Description : '')]
    });
  }

  onSubmit()
  {
    this.itemService.item = this.formModel.value;

    if(this.item == null)
      this.saveItem();
    else
      this.updateItem();
  }

  saveItem()
  {
    this.itemService.createItem().subscribe(
      res => {
        this.toastr.info('Novi proizvod je uspješno kreiran.', 'Info');
        this.dialogRef.close();
      }
    );
  }

  updateItem()
  {
    this.itemService.updateItem().subscribe(
      res => {
        this.toastr.info('Proizvod je uspješno ažuriran.', 'Info');
        this.dialogRef.close();
      }
    );
  }
}

@Component({
  selector: 'dialog-storage-amount',
  templateUrl: 'dialog-storage-amount.html',
  styleUrls: ['dialog-storage-amount.css']
})
export class DialogStorageAmount implements OnInit
{
  storageAmount: number = 0;

  calculateOption: number = 1;
  calculateAmount: number = 0;
  
  constructor(public dialogRef: MatDialogRef<DialogStorageAmount>,
    private itemService: ItemService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
  }

  ngOnInit()
  {
    this.storageAmount = this.data.selectedItem.StorageAmount;
  }

  onChangeCalculateValue(event)
  {
    this.calculateOption = event as number;
  }

  setStorageAmount()
  {
    this.data.selectedItem.StorageAmount = this.storageAmount;
    this.updateItem();
  }

  calculateStorageAmount()
  {
    if (this.calculateOption == 1)
      this.data.selectedItem.StorageAmount += this.calculateAmount;
    else if (this.calculateOption == 2)
    {
      if((this.data.selectedItem.StorageAmount - this.calculateAmount) < 0)
      {
        this.toastr.error("Oduzimanjem ove količine stanje bi bilo manje od nule.", "Greška");
        return;
      }

      this.data.selectedItem.StorageAmount -= this.calculateAmount;
    }

    this.updateItem();
  }

  updateItem()
  {
    this.itemService.item = this.data.selectedItem as Item;
    this.itemService.updateItem().subscribe(
      res => {
        this.dialogRef.close();
        this.toastr.info(`Stanje proizvoda ${this.data.selectedItem.Name} je uspješno ažurirano.`, "Info");
      }
    );
  }
}