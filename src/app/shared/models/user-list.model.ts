export interface UsersListModel {
  data: User[];
}

export interface User {
  userCompanyRoles: UserCompanyRoles[];
  id: number;
  accessTypeId: string;
  avatar: string;
  dateChanged: string;
  dateCreated: string;
  dateDeleted: string;
  hasTempPassword: boolean;
  isBlocked: boolean;
  isSSO: boolean;
  isKeyUser: boolean;
  isSystemBlocked: boolean;
  login: string;
  password: string;
  passwordExpireDate: string;
  personId: string;
  personalData: PersonalData;
  promoCode: string;
  restorePasswordTryCount: number;
  systemBlockReasonText: string;
  unblockTryCount: number;
}

export interface PersonalData {
  address: string;
  birthDate: string;
  branch: string;
  dateChanged: string;
  dateCreated: string;
  dateDeleted: string;
  email: string;
  externalId: number;
  firstName: string;
  id: number;
  lastName: string;
  personalNumber: string;
  phone: string;
  userData: any;
}

export interface UserCompanyRoles {
  id: number;
  userId: number;
  companyId: number;
  roleId: number;
  active: boolean;
  reason: string;
  signLevel: number;
  company: Company;
}

export interface Company {
  dateChanged: string;
  dateCreated: string;
  dateDeleted: string;
  externalId: number;
  id: number;
  isActive: boolean;
  name: string;
  taxCode: string;
  role: string;
}
