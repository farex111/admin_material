import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string ;
      confirmText: string;
      cancelText: string;
      success: boolean;
      warning: boolean;
    }
  ) {
  }

  ngOnInit(): void {
  }

  onClose() {

  }
}
