import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OtpDialogService} from "./otp-dialog.service";
import {ErrorTranslatorPipe} from "../../pipes/error-translator.pipe";
import {Subscription} from "rxjs";
import {SendOperationModel} from "../../models/send-operation.model";
import {StateModel} from "../../models/state.model";

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
  form!: FormGroup;
  userSub!: Subscription;
  operationSub!: Subscription;
  otpLoadingSub!: Subscription;
  otpSendSub!: Subscription;
  user: any;
  operationId!: string;
  error!: string;
  otpSendLoading: boolean = false;
  otpSent: boolean = false;
  otpSendBtnShow: boolean = true;

  @Output() operationResult = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private otpService: OtpDialogService,
    private errorTranslator: ErrorTranslatorPipe
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.otpService.showTimer.next(false);
    this.userSub = this.otpService.user.subscribe((res: any) => {
      this.user = res;
    });
    this.operationSub = this.otpService.otpOperationId.subscribe((res: string) => {
      this.operationId = res;
    })
    this.otpLoadingSub = this.otpService.otpSendLoading.subscribe((res: boolean) => {
      this.otpSendLoading = res;
    })
    this.otpSendSub = this.otpService.otpSent.subscribe((res: boolean) => {
      this.otpSent = res;
    })

    if (this.otpService.timer.value != 0) {
      this.otpService.otpSendLoading.next(true);
      this.otpService.calculateOtpTimer(this.user.id);
      this.otpService.showTimer.next(true);
    }
  }

  initializeForm() {
    this.form = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    })
  }

  sendOtp() {
    this.error = '';
    this.otpSendBtnShow = false;
    this.otpService.otpSendLoading.next(true);
    this.otpService.sendOperation(this.operationId).subscribe((res: SendOperationModel) => {
      this.otpService.otpSent.next(true);
      this.otpSendBtnShow = true;
      this.otpService.calculateOtpTimer(this.user.id);
      this.otpService.showTimer.next(true);
    }, (err: any) => {
      this.otpService.otpSendLoading.next(false);
      this.otpSendBtnShow = true;
      if (err.error) {
        if (err.error.errorCode == "SEND_LOCK") {
          this.otpService.otpSent.next(true);
          this.error = `კოდის გაგზავნა შესაძლებელი იქნება უკუთვლის დასრულების შემდეგ`;
        } else if (
          err.error.errorCode == "OPERATION_LIMIT_EXHAUSTED" ||
          (err.error.errorCode == "SEND_LOCK" && err.error.data.retriesLeft < 1) ||
          err.error.errorCode == "OPERATION_SEND_LIMIT_EXHAUSTED"
        ) {
          this.otpService.getOperationState(this.user.id).subscribe((res: StateModel) => {
            if (res.data.unlockTime) {
              let minutes = this.otpService.calculateLockTimerMinutes(res.data.unlockTime);
              if (typeof minutes === "number") {
                this.otpService.userBlockMinutesLeft.next(minutes);
              }
              this.error = `ოპერაციის მცდელობის ლიმიტი ამოიწურა, ახალი კოდის გაგზავნა შეგეძლებათ : ${minutes ? minutes + " წუთში" : "დრო უცნობია"} `;
            } else {
              this.error = "ოპარაციის მცდელობის ლიმიტი ამოიწურა, ვერ ხერხდება დროის დათვლა როდის შეგეძლებათ ახალი კოდის გაგზავნა";
            }
          }, (err: any) => {
            this.error = "ოპარაციის მცდელობის ლიმიტი ამოიწურა, მოხდა შეცდომა, ვერ ხერხდება დროის დათვლა როდის შეგეძლებათ ახალი კოდის გაგზავნა";
          });
        } else {
          this.error = this.errorTranslator.transform(err.error.errorCode)
        }
      }
    })
  }

  public confirmOperation() {
    if (this.form.valid) {
      const otpCode = this.form.controls['otpCode'].value;
      this.error = '';
      this.otpService.confirmOperation(this.operationId, otpCode).subscribe((res: SendOperationModel) => {
        const data = {
          operation: res.data.operation.operationAlias,
          user: this.user
        }
        if (res.data.success) {
          this.operationResult.emit(data)
        } else {
          this.operationResult.emit(false)
        }
      }, (err: any) => {
        if (err.error) {
          if (err.error.errorCode) {
            if (err.error.errorCode === 'INVALID_OTP' && err.error.data.retriesLeft < 1) {
              this.error = 'კოდი არასწორია, ოპერაციის მცდელობის ლიმიტი ამოიწურა, გთხოვთ გააგზავნოთ ახალი კოდი'
            } else if (err.error.errorCode === 'OPERATION_LIMIT_EXHAUSTED') {
              this.otpService.getOperationState(this.user.id).subscribe((res: StateModel) => {
                if (res.data.unlockTime) {
                  const minutes = this.otpService.calculateLockTimerMinutes(res.data.unlockTime);
                  if (typeof minutes === "number") {
                    this.otpService.userBlockMinutesLeft.next(minutes)
                  }
                  this.error = `ოპერაციის მცდელობის ლიმიტი ამოიწურა, მომხმარებელი დაბლოკილია:
                  ${minutes ? minutes + 'წუთის განმავლობაში' : 'განბლოპკვის დრო უცნობია'}`;
                } else {
                  this.error = 'ოპარაციის მცდელობის ლიმიტი ამოიწურა, ვერ ხერხდება მოხმარებლის განბლოკვის დროის დათვლა';
                }
              }, (err: any) => {
                this.error = 'ოპარაციის მცდელობის ლიმიტი ამოიწურა, მოხდა შეცდომა, ვერ ხერხდება მოხმარებლის განბლოკვის დროის დათვლა';
              });
            } else if (err.error.message.toUpperCase().trim() === 'SEND OTP FIRST') {
              this.error = 'გთხოვთ გააგზავნოთ ახალი კოდი';
            } else {
              this.error = this.errorTranslator.transform(err.error.errorCode);
            }
          }
        } else {
          this.error = 'მოხდა შეცდომა';
        }
      });
    }
  }

  public toggleOtpDialog(): void {
    this.otpService.toggleOtpDialog();
  }

  getSmsCode(event: any) {
    this.form.controls['otpCode'].setValue(event)
  }

  clearSmsCode() {
    this.form.controls['otpCode'].setValue('');
  }
}
