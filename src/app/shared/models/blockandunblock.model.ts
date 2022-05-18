export interface BlockModel {
  data: boolean;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean
}

export interface UnblockModel {
  data: {
    data: boolean;
    operationId: string;
    requiresTwoFactor: boolean;
    smsPhone: string;
    operationUnlockTime: Date;
  };
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean
}

