import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {GetLoyalProgramModel} from "../../shared/models/get-loyal-program.model";
import {GetLoyalProgramFileTopUpsModel} from "../../shared/models/get-loyal-program-file-top-ups.model";

@Injectable({
  providedIn: 'root'
})
export class LoyalProgramService {
  constructor(private http: HttpClient) {
  }

  public uploadExcel(formData: FormData) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http.post(`${environment.apiUrl}/api/v1/LoyalityMobile/topup`, formData)
  }

  public getFiles() {
    return this.http.get<GetLoyalProgramModel[]>(`${environment.apiUrl}/api/v1/LoyalityMobile/files`)
  }

  public getFileTopUps(fileId: string) {
    return this.http.get<GetLoyalProgramFileTopUpsModel []>(`${environment.apiUrl}/api/v1/LoyalityMobile/files/${fileId}/topups`)
  }

  public exportFile(fileId: string, dateFrom?: string, dateTo?: string, status?: string) {
    let params = new HttpParams();
    let headers = new HttpHeaders();

    if (dateFrom) {
      params = params.append("DateFrom", dateFrom)
    }
    if (dateTo) {
      params = params.append("DateTo", dateTo);
    }
    if (status) {
      params = params.append("Status", status);
    }
    if (fileId) {
      params = params.append("FileId", fileId);
    }
    headers = headers.append("FileId", fileId);
    return this.http.get(`${environment.apiUrl}/api/v1/LoyalityMobile/files/export`, {
      params: params,
      headers: headers,
      responseType: "text",
    })
  }
}
