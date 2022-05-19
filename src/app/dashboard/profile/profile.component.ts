import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, map, Observable, Subscription, tap} from "rxjs";
import {UserService} from "../../shared/services/user.service";
import {UserModel1} from "../../shared/models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PasswordMatchValidator} from "../../shared/custom-validators/password-match-validator";
import {MyErrorStateMatcher} from "../../shared/custom-validators/error-state-matcher";
import {ProfileService} from "./profile.service";
import {ChangePasswordModel} from "../../shared/models/change-password.model";
import {LandingService} from "../../landing/landing.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../shared/services/loading.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  oldPassHide: boolean = true;
  newPassHide: boolean = true;
  repeatPassHide: boolean = true;
  userData!: UserModel1;
  userDataSub!: Subscription;
  changePassFormSub!: Subscription;
  changePassForm!: FormGroup;

  userData$!: Observable<UserModel1>
  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private landingService: LandingService,
    private router: Router,
    private loaderService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.loaderService.start();
    this.initializeForm();
    this.userData$ = this.userService.getUserData().pipe(map((res => res.data)), tap((res: UserModel1) => {
      if (res.hasTempPassword) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'პაროლის ცვლილება',
            content: 'You have temporary password',
            cancelText: 'დახურვა',
            warning: true
          }
        })
      }
    }), finalize(() => this.loaderService.stop()));
  }

  ngOnDestroy(): void {
    if (this.changePassFormSub) {
      this.changePassFormSub.unsubscribe();
    }
  }

  initializeForm(): void {
    this.changePassForm = this.fb.group({
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*\d)(?!.*[ა-ჰ]).{8,}/)]],
        passwordConfirm: ['', [Validators.required]]
      },
      {validators: PasswordMatchValidator.passwordsMatching}
    )
  }

  onSubmit() {
    this.loaderService.start();
    const oldPassword = this.changePassForm.controls['oldPassword'].value;
    const newPassword = this.changePassForm.controls['password'].value;
    const passwordConfirm = this.changePassForm.controls['passwordConfirm'].value;
    this.changePassFormSub = this.profileService.changePassword(this.userData.id, oldPassword, newPassword, passwordConfirm)
      .subscribe((res: ChangePasswordModel) => {
        this.loaderService.stop();
        if (!res.errorCode) {
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'წარმატება',
              content: 'პაროლი წარმატებით შეიცვალა',
              cancelText: 'დახურვა',
              success: true
            }
          });
          setTimeout(() => {
            this.landingService.authorizeUser(this.userData.userName, newPassword);
            this.router.navigate(['users'])
          }, 3000);
        } else {
          oldPassword.reset();
        }
      })
  }

  changeBackgroundPhoto(): string {
    if (this.changePassForm.invalid && this.changePassForm.touched) {
      return 'url(../../../assets/images/icons/password-red.svg)'
    } else {
      return 'url(../../../assets/images/icons/password-blue.svg)'
    }
  }
}
