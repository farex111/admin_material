export interface AdminUsersModel {
  data: AdminUser []
}

export interface AdminUser {
  firstName: string;
  lastName: string;
  mobile: string;
  personalNumber: string;
  userName: string;
  id: number;
  connectedRoles: ConnectedRole [];
}

export interface ConnectedRole {
  id: number;
  name: string;
}
