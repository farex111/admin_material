import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {OtpDialogService} from "../otp-dialog/otp-dialog.service";

@Component({
  selector: 'app-sms-request',
  templateUrl: './sms-request.component.html',
  styleUrls: ['./sms-request.component.scss']
})
export class SmsRequestComponent implements OnInit {
  timerSub!: Subscription;
  otpSentSub!: Subscription;
  showTimerSub!: Subscription;
  otpSendLoadingSub!: Subscription;
  interval: any;
  showTimer: boolean = false;
  otpSendLoading: boolean = false;
  clearBtnHovered: boolean = false;
  smsCode: string = '';
  Math!: Math;

  @Input() time!: number;
  @Input() valid: boolean = true;
  @Input() disabled: boolean = false;
  @Input() loading: any;

  @Output() giveCode = new EventEmitter<string>();
  @Output() clear = new EventEmitter<any>();

  constructor(private otpService: OtpDialogService) {
    this.Math = Math;
  }

  ngOnInit(): void {
    this.timerSub = this.otpService.timer.subscribe((res: number) => {
      this.time = res;
      this.timerFunction();
    });
    this.otpSentSub = this.otpService.otpSent.subscribe((res: boolean) => {
      this.disabled = !res;
    })
    this.showTimerSub = this.otpService.showTimer.subscribe((res: boolean) => {
      this.showTimer = res;
    })
    this.otpSendLoadingSub = this.otpService.otpSendLoading.subscribe((res: boolean) => {
      this.otpSendLoading = res;
    })
  }

  smsOnInput() {
    this.giveCode.emit(this.smsCode);
  }

  disableSelect(e: any) {
    e.target.selectionStart = e.target.selectionEnd;
  }

  disableArrows(e: any) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
    }
  }

  onClearHover() {
    this.clearBtnHovered = true;
  }

  onClearBlur() {
    this.clearBtnHovered = false;
  }

  clearCode() {
    this.smsCode="";
    this.clear.emit();
  }

  resetOnTimePassed() {
    if (this.otpService.timer.value == 0) {
      clearInterval(this.interval);
      this.smsCode = "";
      this.giveCode.emit(this.smsCode);
    }
  }

  timerFunction() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.otpService.timer.value != 0) {
        this.otpService.timer.next(this.otpService.timer.value - 1);
        if (this.otpService.timer.value === 0) {
          clearInterval(this.interval);
          this.otpService.otpSent.next(false);
        }
      }
    }, 1000)
  }

}
