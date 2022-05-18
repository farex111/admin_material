export interface UserModel {
  data: UserModel1;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string [];
  isAuth: boolean;
}

export interface UserModel1 {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  personalNumber: string;
  hasTempPassword: boolean;
  role: string;
  permissions: string []
}
