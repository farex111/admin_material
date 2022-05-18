export class GetRolesModel {
  data!: Role []
  detailsMessage!: string;
  errorCode!: string;
  externalState!: number;
  state!: number;
  message!: string;
  isAuth!: boolean;
  validationErrors!: string[];
}

export class Role {
  adminUserRoles!: string;
  alias!: string;
  dateCreated!: Date;
  id!: number;
  name!: string;
  rolePermissions!: string;
}
