export interface FaceRecognitionModel {
  data: FaceRecognitionList;
  detailsMessage: string;
  errorCode: string;
  externalState: number;
  state: number;
  isAuth: boolean;
  message: string;
  validationErrors: string [];
}

export interface FaceRecognitionList {
  faceRecognitionList: FaceRecognition[];
  pageCount: number;
  totalItemCount: number;
}

export interface FaceRecognition {
  birthdayPlace: string;
  dateCreated: Date;
  dob: string;
  docNumber: string;
  draftLoanApplicationId: string;
  eventId: string;
  expDate: string;
  gender: string;
  id: number;
  idCardBackImage: string;
  idCardFrontImage: string;
  idNum: string;
  loanType: number;
  matchLevel: number;
  name: string;
  selfieImage: string;
  status: string;
  success: boolean;
  surName: string;
  userId: number;
}
