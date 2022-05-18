import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AddNewAdminModel} from "../../../shared/models/add-new-admin.model";

@Injectable({
  providedIn: 'root'
})
export class RegisterAdminService {
  constructor(private http: HttpClient) {
  }

  addAdminUser(userName: string, firstName: string, lastName: string, personalId: string, mobile: string) {
    return this.http.post<AddNewAdminModel>(`${environment.apiUrl}/Admin/AddAdminUser`, {
      userName,
      firstName,
      lastName,
      personalId,
      mobile
    })
  }
}
