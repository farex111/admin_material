import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User, UsersListModel} from "../../shared/models/user-list.model";
import {finalize, map, Observable, Subscription} from "rxjs";
import {UsersService} from "./users.service";
import {BlockModel, UnblockModel} from "../../shared/models/blockandunblock.model";
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {OtpDialogService} from "../../shared/components/otp-dialog/otp-dialog.service";
import {ErrorTranslatorPipe} from "../../shared/pipes/error-translator.pipe";
import {UserService} from "../../shared/services/user.service";
import {Router} from "@angular/router";
import {UserModel, UserModel1} from "../../shared/models/user.model";
import {GenerateNewPasswordModel} from "../../shared/models/generate-newpassword.model";
import {SelectionDialogComponent} from "../../shared/components/selection-dialog/selection-dialog.component";
import {CompanyBlockReasonsEnum} from "../../shared/enums/company-block-reasons.enum";
import {LoadingService} from "../../shared/services/loading.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  otpDialogOpen: boolean = false;
  searchForm!: FormGroup;
  authUser!: UserModel1;
  blockReasonText!: string;

  userList$!: Observable<Array<User>>;

  blockSsoUserSub!: Subscription;
  unblockSsoUserSub!: Subscription;
  blockCompanySub!: Subscription;
  unblockCompanySub!: Subscription;
  otpDialogOpenSub!: Subscription;
  userPermissionSub!: Subscription;
  authUserSub!: Subscription;
  generateNewPasswordSub!: Subscription;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private otpService: OtpDialogService,
    private errorTranslator: ErrorTranslatorPipe,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  ngOnDestroy(): void {
    if (this.blockSsoUserSub) {
      this.blockSsoUserSub.unsubscribe();
    }
    if (this.unblockSsoUserSub) {
      this.unblockSsoUserSub.unsubscribe();
    }
    if (this.otpDialogOpenSub) {
      this.otpDialogOpenSub.unsubscribe();
    }
    if (this.userPermissionSub) {
      this.userPermissionSub.unsubscribe();
    }
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
    if (this.generateNewPasswordSub) {
      this.generateNewPasswordSub.unsubscribe();
    }
    if (this.blockCompanySub) {
      this.blockCompanySub.unsubscribe();
    }
    if (this.unblockCompanySub) {
      this.unblockCompanySub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fetchAdminUserInfo();
    this.initializeForm();
    this.userPermissionSub = this.userService.permissions.subscribe((res: string[]) => {
      if (res !== undefined) {
        if (!res.includes('Permissions.SearchUser')) {
          this.router.navigate(['role-management'])
        }
      }
    })
    this.otpDialogOpenSub = this.otpService.otpDialogOpen.subscribe((res: boolean) => {
      this.otpDialogOpen = res;
    })
  }

  fetchAdminUserInfo(): void {
    this.loadingService.start();
    if (!this.authUser) {
      this.authUserSub = this.userService.getUserData().subscribe((res: UserModel) => {
        this.loadingService.stop();
        if (!res.errorCode) {
          this.authUser = res.data;
        } else {
          this.dialog.open(DialogComponent, {
            width: '30%',
            restoreFocus: false,
            data: {
              title: 'შეცდომა',
              content: '',
              cancelText: 'დახურვა',
              warning: true
            }
          })
        }
      })
    }
  }

  initializeForm() {
    this.searchForm = new FormGroup({
      searchValue: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  submitForm() {
    this.loadingService.start();
    const searchValue = this.searchForm.controls['searchValue'].value
    this.userList$ = this.usersService.fetchUsers(searchValue).pipe(
      map((res: UsersListModel) => res.data), finalize(() => this.loadingService.stop())
    );
  }

  blockSsoUser(userId: number) {
    this.loadingService.start();
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ მომხმარებლის დაბლოკვა?',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.blockSsoUserSub = this.usersService.blockUser(userId).subscribe((res: BlockModel) => {
          this.loadingService.stop();
          if (res.data) {
            if (res.errorCode) {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: true,
                data: {
                  title: 'შეცდომა',
                  content: res.errorCode,
                  cancelText: 'დახურვა',
                  warning: true
                }
              });
            } else {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: true,
                data: {
                  title: 'წარმატება',
                  content: 'მოხმარებელი დაბლოკილია',
                  cancelText: 'დახურვა',
                  success: true
                }
              });
              this.submitForm();
            }
          }
        })
      } else {
        this.submitForm();
      }
    })
  }

  blockCompany(userId: number, companyId: number) {
    this.loadingService.start();
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ კომპანიის დაბლოკვა',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.dialog.open(SelectionDialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'დაბლოკვის მიზეზი',
            reasons: [
              CompanyBlockReasonsEnum.client,
              CompanyBlockReasonsEnum.government,
              CompanyBlockReasonsEnum.aml,
              CompanyBlockReasonsEnum.other
            ]
          }
        }).afterClosed().subscribe((res: string) => {
          if (res) {
            this.blockCompanySub = this.usersService.blockCompany(userId, companyId, res).subscribe((res: BlockModel) => {
              this.loadingService.stop();
              if (res.errorCode) {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: res.errorCode,
                    cancelText: 'დახურვა',
                    warning: true
                  }
                });
              } else {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'წარმატება',
                    content: 'კომპანია დაბლოკილია',
                    cancelText: 'დახურვა',
                    success: true
                  }
                });
                this.submitForm();
              }
            })
          } else {
            this.submitForm();
          }
        })
      } else {
        this.submitForm();
      }
    })
  }

  unblockCompany(userId: number, companyId: number, user: User) {
    this.loadingService.start();
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ კომპანიის განბლოკვა?',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.unblockCompanySub = this.usersService.unblockCompany(userId, companyId, '').subscribe((res: UnblockModel) => {
          this.loadingService.stop();
          if (res.errorCode) {
            if (res.errorCode === 'OPERATION_LIMIT_EXHAUSTED') {
              const minutes = this.otpService.calculateLockTimerMinutes(res.data.operationUnlockTime);
              this.dialog.open(DialogComponent, {
                width: '30%',
                disableClose: true,
                restoreFocus: true,
                data: {
                  title: 'შეცდომა',
                  content: `მომხმარებელზე შეუძლებელია კოდის დაგენერირება ${minutes != null ? minutes + 'წუთის განმავლობაში' : 'დარჩენილი დრო უცნობია'}`,
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            } else if (res.message.toUpperCase() === 'INVALID USER') {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: true,
                data: {
                  title: 'შეცდომა',
                  content: 'მომხმარებელზე შეუძლებელია ოპერაციის განხორციელება',
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            } else {
              const errorText = this.errorTranslator.transform(res.errorCode);
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: errorText,
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            }
          } else {
            if (res.data.requiresTwoFactor && res.data.operationId) {
              if (res.data.smsPhone) {
                user.personalData.phone = res.data.smsPhone;
                this.toggleOtpDialog(user, res.data.operationId)
              } else {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: `${user.login} -ის ნომერი ვერ მოიძებნა`,
                    cancelText: 'დახურვა',
                    warning: true
                  }
                })
              }
            } else if (!res.data.requiresTwoFactor && res.data.data) {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'წარმატება',
                  content: `მომხმარებელი: ${user.login} განბლოკილია`,
                  cancelText: 'დახურვა',
                  success: true
                }
              })
              this.submitForm();
            }
          }
        })
      } else {
        this.submitForm();
      }
    })

  }

  unblockSsoUser(user: User) {
    this.loadingService.start();
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ მომხმარებლის განბლოკვა?',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.unblockSsoUserSub = this.usersService.unblockUser(user.id).subscribe((res: UnblockModel) => {
          this.loadingService.stop();
          if (res.errorCode) {
            if (res.errorCode === 'OPERATION_LIMIT_EXHAUSTED') {
              const minutes = this.otpService.calculateLockTimerMinutes(res.data.operationUnlockTime);
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: `მომხმარებელზე შეუძლებელია კოდის დაგენერირება ${minutes != null ? minutes + 'წუთის განმავლობაში' : 'დარჩენილი დრო უცნობია'}`,
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            } else if (res.message.toUpperCase() === 'INVALID USER') {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: 'მომხმარებელზე შეუძლებელია ოპერაციის განხორციელება',
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            } else {
              const errorText = this.errorTranslator.transform(res.errorCode);
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: errorText,
                  cancelText: 'დახურვა',
                  warning: true
                }
              })
            }
          } else {
            if (res.data.requiresTwoFactor && res.data.operationId) {
              if (res.data.smsPhone) {
                user.personalData.phone = res.data.smsPhone;
                this.toggleOtpDialog(user, res.data.operationId)
              } else {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: `${user.login} -ის ნომერი ვერ მოიძებნა`,
                    cancelText: 'დახურვა',
                    warning: true
                  }
                })
              }
            } else if (!res.data.requiresTwoFactor && res.data.data) {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'წარმატება',
                  content: `მომხმარებელი: ${user.login} განბლოკილია`,
                  cancelText: 'დახურვა',
                  success: true
                }
              })
              this.submitForm();
            }
          }
        })
      } else {
        this.submitForm();
      }
    })
  }

  generateNewPassword(user: User) {
    this.loadingService.start();
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ ახალი პაროლის დაგენერირება?',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.generateNewPasswordSub = this.usersService.generateNewPassword(user.id)
          .subscribe((res: GenerateNewPasswordModel) => {
            this.loadingService.stop();
            if (res.errorCode) {
              if (res.errorCode === 'OPERATION_LIMIT_EXHAUSTED') {
                const minutes = this.otpService.calculateLockTimerMinutes(res.data.operationUnlockTime);
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: `მომხმარებელზე შეუძლებელია კოდის დაგენერირება
                ${minutes != null ? minutes + 'წუთის განმავლობაში' : 'დარჩენილი დრო უცნობია'}`,
                    cancelText: 'დახურვა',
                    warning: true
                  }
                });
              } else if (res.message === 'invalid user') {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: 'მომხმარებელზე შეუძლებელია ოპერაციის განხორციელება',
                    cancelText: 'დახურვა',
                    warning: true
                  }
                })
              } else {
                const errorText = this.errorTranslator.transform(res.errorCode);
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'შეცდომა',
                    content: errorText,
                    cancelText: 'დახურვა',
                    warning: true
                  }
                })
              }
            } else {
              if (res.data.requiresTwoFactor && res.data.operationId) {
                if (res.data.smsPhone) {
                  user.personalData.phone = res.data.smsPhone;
                  this.toggleOtpDialog(user, res.data.operationId);
                } else {
                  this.dialog.open(DialogComponent, {
                    width: '30%',
                    restoreFocus: false,
                    data: {
                      title: 'შეცდომა',
                      content: `${user.login} - ის ნომერი ვერ მოიძებნა`,
                      cancelText: 'დახურვა',
                      warning: true
                    }
                  })
                }
              } else if (!res.data.requiresTwoFactor && res.data.data) {
                this.dialog.open(DialogComponent, {
                  width: '30%',
                  restoreFocus: false,
                  data: {
                    title: 'წარმატება',
                    content: 'ახალი პაროლი დაგენერირებულია',
                    cancelText: 'დახურვა',
                    success: true
                  }
                })
              }
            }
          })
      } else {
        this.submitForm();
      }
    })

  }

  toggleOtpDialog(user?: User, operationId?: string) {
    if (user && operationId) {
      this.otpService.toggleOtpDialog(user, operationId)
    } else {
      this.otpService.toggleOtpDialog()
    }
  }

  getOperationResult(data: any) {
    if (data.operation === 'UnblockSsoUser') {
      this.getUnblockResult(data.user);
    }
    if (data.operation === 'SsoUserResetPassword') {
      this.getPasswordResetResult(data.user);
    }
    if (data.operation === 'UnblockCompanyUser') {
      this.getUnblockCompanyResult(data.user);
    }
  }

  getPasswordResetResult(user: User) {
    if (user) {
      this.toggleOtpDialog();
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'წარმატება',
          content: `${user.personalData.firstName} ${user.personalData.lastName} -ს პაროლი დაგენერირებულია`,
          cancelText: 'დახურვა',
          success: true
        }
      })
    } else {
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'შეცდომა',
          content: 'ვერ მოხერხდა პაროლის გენერაცია',
          cancelText: 'დახურვა',
          warning: true
        }
      })
    }
  }

  getUnblockResult(user: User) {
    if (user) {
      this.toggleOtpDialog();
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'წარმატება',
          content: `მომხმარებელი ${user.personalData.firstName} ${user.personalData.lastName} -განბლოკილია`,
          cancelText: 'დახურვა',
          success: true
        }
      })
      this.submitForm()
    } else {
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'შეცდომა',
          content: 'განბლოკვა ვერ მოხერხდა',
          cancelText: 'დახურვა',
          warning: true
        }
      })
    }
  }

  getUnblockCompanyResult(user: User) {
    if (user) {
      this.toggleOtpDialog();
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'წარმატება',
          content: `კომპანია განბლოკილია`,
          cancelText: 'დახურვა',
          success: true
        }
      })
      this.submitForm()
    } else {
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'შეცდომა',
          content: 'განბლოკვა ვერ მოხერხდა',
          cancelText: 'დახურვა',
          warning: true
        }
      })
    }
  }
}
