export interface ChangePasswordModel {
  data: boolean;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean;
}
