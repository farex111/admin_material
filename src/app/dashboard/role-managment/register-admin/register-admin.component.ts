import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {RegisterAdminService} from "./register-admin.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {LoadingService} from "../../../shared/services/loading.service";
import {AddNewAdminModel} from "../../../shared/models/add-new-admin.model";

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent implements OnInit, OnDestroy {
  indexNumbers: number [] = [514, 551, 555, 557, 558, 568, 570, 571, 574, 577, 578, 579, 591, 592, 593, 595, 596, 597, 598, 599];
  myPattern: string = "^";
  loading: boolean = false;
  registerForm!: FormGroup;
  addAdminUserSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private registerAdminService: RegisterAdminService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.addAdminUserSub) {
      this.addAdminUserSub.unsubscribe()
    }
  }

  setPhoneIndexPattern() {
    for (const indexNumber of this.indexNumbers) {
      this.myPattern += indexNumber + "[0-9]+|";
    }
    this.myPattern += this.indexNumbers.lastIndexOf(1) + "[0-9]+";
  }

  initializeForm() {
    this.setPhoneIndexPattern();
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[a-z0-9]*")]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern("[ა-ჰ]*")]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[ა-ჰ]*")]],
      personalId: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("[0-9]*")]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.myPattern)]]
    })
  }

  submitForm() {
    this.loadingService.start();
    const userName = this.registerForm.controls['userName'].value;
    const firstName = this.registerForm.controls['firstName'].value;
    const lastName = this.registerForm.controls['lastName'].value;
    const personalId = this.registerForm.controls['personalId'].value;
    const phone = this.registerForm.controls['phone'].value;
    this.addAdminUserSub = this.registerAdminService.addAdminUser(userName, firstName, lastName, personalId, phone)
      .subscribe((res: AddNewAdminModel) => {
        this.loadingService.stop();
        if (res.validationErrors) {
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'შეცდომა',
              content: res.validationErrors[0],
              cancelText: ' დახურვა',
              warning: true
            }
          });
        } else {
          this.registerForm.reset();
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'წარმატება',
              content: 'ახალი ადმინი დამატებულია',
              cancelText: 'დახურვა',
              success: true
            }
          });
        }
      });
  }
}
