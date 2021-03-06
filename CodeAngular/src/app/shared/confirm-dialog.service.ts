import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material";
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog)
  {
  }

  openConfirmDialog(msg)
  {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog',
      disableClose: true,
      data: {
        message: msg
      }
    })
  }
}
