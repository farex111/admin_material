import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {LandingService} from "../landing.service";
import {Router} from "@angular/router";
import {AuthModel} from "../../shared/models/auth.model";
import {GeneralRequestService} from "../../shared/services/general-request.service";
import {LoadingService} from "../../shared/services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  authorizationForm!: FormGroup;
  authorizeUserSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private landingService: LandingService,
    private generalRequestService: GeneralRequestService,
    private router: Router,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.authorizeUserSub) {
      this.authorizeUserSub.unsubscribe();
    }
  }

  initializeForm() {
    this.authorizationForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submitForm() {
    this.authorizeUser();
  }

  authorizeUser() {
    this.loadingService.start();
    const userName = this.authorizationForm.controls['userName'].value;
    const password = this.authorizationForm.controls['password'].value;
    this.authorizeUserSub = this.landingService
      .authorizeUser(userName, password)
      .subscribe((res: AuthModel) => {
        this.loadingService.stop();
        if (res.data && res.data.token) {
          this.generalRequestService.setToken(res.data.token);
          this.router.navigate(['dashboard']);
        } else if (res.errorCode === 'INVALID_LOGIN') {
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'შეცდომა',
              content: 'მომხმარებლის სახელი არასწორია',
              cancelText: 'დახურვა',
              warning: true
            }
          });
        } else if (res.errorCode === 'INVALID_PASSWORD') {
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'შეცდომა',
              content: 'პაროლი არასწორია',
              cancelText: 'დახურვა',
              warning: true
            }
          });
        }
      })
  }
}
