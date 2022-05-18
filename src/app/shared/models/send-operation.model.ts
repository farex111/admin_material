export interface SendOperationModel {
  data: Data;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean;
}

export interface Data {
  retriesLeft: number;
  success: boolean;
  operation: Operation;
}

export interface Operation {
  id: string;
  operationAlias: string;
  input: string;
  status: number;
  lockTime: Date;
  twoFactorType: number;
  sendCount: number;
  lastChallengeDate: Date;
  challenges: Challenges [];
  createdDate: Date;
  userId: number;
  phone: string;
  personalNumber: string;
  fullName: string;
  adminUserId: number;
  adminRole: string;
  adminFullName: string;
}

export interface Challenges {
  id: number;
  operationId: string;
  twoFactorIdentifier: string;
  otp: string;
  confirmCount: number;
  challengeCreatedDate: Date;
}
