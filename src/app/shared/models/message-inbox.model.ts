export interface MessageInboxModel {
  isInbox: boolean;
  isSent: boolean;
  adminLogin: string;
  all: boolean;
  from: Date;
  to: Date;
  adminUserId: number;
  personalNumber: string;
  keyword: string;
  pageSize: number;
  pageNumber: number;
}
