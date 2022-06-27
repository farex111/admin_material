export interface SearchedDataModel {
  data: SearchedData;
  detailsMessage: string;
  externalState: number;
  isAuth: boolean;
  message: string;
  state: number;
  validationErrors: string [];
  errorCode: string;
}

export interface SearchedData {
  itemList: SearchedDataList[];
  pageCount: number;
  totalItemCount: number
}

export interface SearchedDataList {
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
