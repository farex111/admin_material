export interface PushNotificationsModel {
  data: PushNotificationsData[];
  message: string;
  detailsMessage: string;
  externalState: number;
  state: number;
  errorCode: string;
  validationErrors: string[];
  isAuth: boolean;
}

export interface PushNotificationsData {
  id: number;
  name: string;
  title: string;
  text: string;
  parentId?: number;
  deliveryDate: string;
  createdDate: string;
  updateDate: string;
  deletedDate?: string;
  userId?: number;
  isForLegalPersons: boolean;
  status: number;
  type: number;
  canVerify: boolean;
}
