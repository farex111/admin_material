import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ChangePasswordModel} from "../../shared/models/change-password.model";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {
  }

  changePassword(adminUserId: number, oldPassword: string, newPassword: string, repeatPassword: string) {
    return this.http.post<ChangePasswordModel>(`${environment.apiUrl}/Admin/ChangeAdminPassword`, {
      adminUserId,
      oldPassword,
      newPassword,
      repeatPassword
    })
  }
}
