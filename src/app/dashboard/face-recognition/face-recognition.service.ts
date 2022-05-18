import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FaceRecognitionModel} from "../../shared/models/face-recognition.model";

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  constructor(private http: HttpClient) {
  }

  fetchFaceRecognitionData(personalNumber: string, startDate: string, endDate: string, pageSize: number, pageNumber: number) {
    return this.http.post<FaceRecognitionModel>(`${environment.apiUrl}/FaceRecognition/GetFaceRecognitionData`, {
      personalNumber,
      startDate,
      endDate,
      pageSize,
      pageNumber
    })
  }
}
