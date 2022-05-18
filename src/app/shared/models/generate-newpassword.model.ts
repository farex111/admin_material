export interface GenerateNewPasswordModel {
  data: GeneratePass;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean;
}

export interface GeneratePass {
  data: boolean;
  operationId: string;
  requiresTwoFactor: boolean;
  smsPhone: string;
  operationUnlockTime: Date;
}
