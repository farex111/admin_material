export interface AuthModel {
  data: {
    token: string;
  }
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationError: string[];
  isAuth: boolean;
}
