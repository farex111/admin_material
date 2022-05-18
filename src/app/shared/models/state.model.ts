export interface StateModel {
  data: {
    locked: boolean;
    unlockTime: Date;
    sendLock: boolean;
    sendUnlockTime: Date;
    sendLefts: number;
  }
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean;
}
