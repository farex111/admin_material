export interface MessageInboxModel {
  data: MessageInboxData;
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: number;
  validationErrors: Array<string>;
  isAuth: boolean;
}

export interface MessageInboxData {
  itemList: Array<MessageInboxItemsList>;
  pageCount: number;
  totalItemsCount: number
}

export interface MessageInboxItemsList {
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
  isReadByUser: string;
  personalNumber: string;
  subject: string;
  total: number;
  unreadCount: number
}
