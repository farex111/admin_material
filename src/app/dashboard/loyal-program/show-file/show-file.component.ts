import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Permission} from "../../../shared/models/get-permissions.model";

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss']
})
export class ShowFileComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowFileComponent>, @Inject(MAT_DIALOG_DATA)
    public data: { permissions: Permission []; }
  ) {
  }

  ngOnInit(): void {
  }

}
