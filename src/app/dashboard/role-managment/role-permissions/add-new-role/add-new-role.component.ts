import {Component, Inject, OnInit} from '@angular/core';
import {Permission} from "../../../../shared/models/get-permissions.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../../../shared/models/get-roles.model";

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.scss']
})
export class AddNewRoleComponent implements OnInit {
  addNewRoleForm!: FormGroup;
  result: { data: Role[]; roleName: string; } = {data: [], roleName: ''};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewRoleComponent>, @Inject(MAT_DIALOG_DATA)
    public data: { permissions: Permission []; }
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.addNewRoleForm = this.fb.group({
      roleName: ['', [Validators.required]],
      search: [''],
      permissionId: ['', [Validators.required]]
    })
  }

  submitForm() {
    this.result.data = this.addNewRoleForm.controls['permissionId'].value;
    this.result.roleName = this.addNewRoleForm.controls['roleName'].value;

    return this.result
  }
}
