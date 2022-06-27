import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ComposeComponent>, @Inject(MAT_DIALOG_DATA)
    public data: { user: string; }
  ) {
  }

  ngOnInit(): void {
  }

}
