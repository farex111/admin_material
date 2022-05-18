export interface GetPermissionsModel {
  data: Permission []
  detailsMessage: string;
  errorCode: string;
  externalState: number;
  state: number;
  message: string;
  isAuth: boolean;
  validationErrors: string[];
}

export interface Permission {
  alias:string;
  dateCreated: Date;
  id: number;
  name: string;
}
