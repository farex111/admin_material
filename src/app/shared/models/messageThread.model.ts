export interface MessageThreadModel {
  data: Array<MessageThread>;
  detailsMessage: string;
  externalState: number;
  isAuth: boolean;
  message: string;
  errorCode: string;
  state: number;
  validationErrors: Array<string>;
}

export interface MessageThread {
  authorFullName: string;
  body: string;
  clientFirstName: string;
  clientLastName: string;
  dateCreated: string;
  dateCreatedFormatted: string;
  dateDeletedByAdmin: string;
  dateDeletedByUser: string;
  id: number;
  isFromSystem: boolean;
  isReadByAdmin: boolean;
  isReadByUser: boolean;
  personalNumber: string;
  subject: string;
  total: number;
  unreadCount: number;
}
