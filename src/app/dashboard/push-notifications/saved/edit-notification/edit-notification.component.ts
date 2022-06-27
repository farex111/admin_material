import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.scss']
})
export class EditNotificationComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditNotificationComponent>, @Inject(MAT_DIALOG_DATA)
    public data: {
      canVerify: boolean,
      createdDate: string,
      deliveryDate: string,
      id: number,
      isForLegalPersons: boolean,
      name: string,
      status: number,
      text: string,
      title: string,
      type: number,
      updateDate: string,
    },
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initializeEditForm();
  }

  initializeEditForm() {
    this.editForm = this.fb.group({
      name: [this.data.name],
      title: [this.data.title],
      date: [this.data.deliveryDate],
      isForLegalPersons: [this.data.isForLegalPersons],
      topic: [null],
      type: [this.data.type],
      message: [this.data.text],
    })
  }
}
