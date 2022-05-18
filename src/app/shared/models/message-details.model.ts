export interface MessageDetailsModel {
  data: {
    senderUserId: number;
    senderPersonFirstName: string;
    senderPersonLastName: string;
    recieverPersonFirstName: string;
    recieverPersonLastName: string;
    recieverPersonId: number;
    adminFirstName: string;
    adminLastName: string;
    id: number;
    prevMessageId: number;
    nextMessageId: number;
    parentMessageId: number;
    adminUserId: number;
    isReadByAdmin: boolean;
    subject: string;
    body: string;
    isSentToAll: boolean;
    bulkId: string;
    dateCreated: string;
    dateDeletedByUser: string;
    dateDeletedByAdmin: string;
    threadUpdateDate: string;
    hasReplyOption: boolean;
    userMessage: UserMessage;
    attachements: Attachments;
  }
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: number;
  validationErrors: Array<string>;
  isAuth: boolean;
}

export interface UserMessage {
  id: number;
  UserId: number;
  messageId: number;
  isRead: boolean;
}

export interface Attachments {
  id: number;
  bulkId: string;
  docName: string;
  documentContent: string;
  extension: string;
}
