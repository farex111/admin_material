import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../../models/user-list.model";
import {environment} from "../../../../environments/environment";
import {SendOperationModel} from "../../models/send-operation.model";
import {StateModel} from "../../models/state.model";

@Injectable({
  providedIn: 'root'
})
export class OtpDialogService {
  otpDialogOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  otpSent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  otpSendLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showTimer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  otpOperationId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  // @ts-ignore
  timer: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  // @ts-ignore
  userBlockMinutesLeft: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) {
  }

  public toggleOtpDialog(user?: User, operationId?: string): void {
    this.otpSent.next(false);
    if (user) {
      this.user.next(user)
    }
    if (operationId) {
      this.otpOperationId.next(operationId)
    }
    this.otpDialogOpen.next(!this.otpDialogOpen.value)
  }

  public sendOperation(operationId: string) {
    let params = new HttpParams().set('operationId', operationId);
    return this.http.post<SendOperationModel>(`${environment.apiUrl}/Admin/Send`, null, {
      params,
    });
  }

  public confirmOperation(operationId: string, otp: any) {
    return this.http.post<SendOperationModel>(`${environment.apiUrl}/Admin/Confirm`, {
      operationId,
      otp
    })
  }

  public getOperationState(userId: number) {
    let params = new HttpParams().set('userId', userId);
    return this.http.get<StateModel>(`${environment.apiUrl}/admin/user/${userId}/state`, {
      params
    })
  }

  public calculateOtpTimer(userId: number) {
    this.getOperationState(userId).subscribe((res: StateModel) => {
      this.otpSendLoading.next(false);
      if (res.data.sendLock) {
        this.otpSent.next(true);
        const seconds = this.calculateLockTimerSeconds(res.data.sendUnlockTime);
        this.timer.next(seconds);
      } else {
        this.showTimer.next(false);
        this.otpSent.next(false);
      }
    })
  }

  public calculateUserBlockTime(userId: number) {
    this.getOperationState(userId).subscribe((res: StateModel) => {
      if (res.data.locked) {
        const minutes = this.calculateLockTimerMinutes(res.data.unlockTime);
        if (typeof minutes === "number") {
          this.userBlockMinutesLeft.next(minutes)
        }
      }
    })
  }

  public calculateLockTimerMinutes(date: Date) {
    if (date != null) {
      const unlockDate = new Date(date);
      const now = new Date();
      const timeLeft = Math.abs(unlockDate.getTime() - now.getTime());
      return Math.ceil(timeLeft / 1000 / 60)
    } else {
      return null
    }
  }

  public calculateLockTimerSeconds(date: Date): number {
    const unlockDate = new Date(date);
    const now = new Date();
    const timeLeft: any = Math.abs(unlockDate.getTime() - now.getTime());
    return Math.ceil(timeLeft / 1000);
  }
}
