import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Permission} from "../../../../shared/models/get-permissions.model";

@Component({
  selector: 'app-add-permissions-to-role',
  templateUrl: './add-permissions-to-role.component.html',
  styleUrls: ['./add-permissions-to-role.component.scss']
})
export class AddPermissionsToRoleComponent implements OnInit {
  search: string = '';
  selectedPermissions!: Permission[]

  constructor(
    public dialogRef: MatDialogRef<AddPermissionsToRoleComponent>, @Inject(MAT_DIALOG_DATA)
    public data: { permissions: Permission []; }
  ) { }

  ngOnInit(): void {
  }

  submitResult() {
    return this.selectedPermissions
  }

}
