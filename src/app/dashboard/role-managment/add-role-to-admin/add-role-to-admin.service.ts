import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AdminUsersModel} from "../../../shared/models/get-admin-users.model";
import {GenerateAdminPasswordModel} from "../../../shared/models/generate-admin-password.model";

@Injectable({
  providedIn: 'root'
})
export class AddRoleToAdminService {
  constructor(private http: HttpClient) {
  }

  addRoleToUser(userId: number, roleId: number) {
    return this.http.post(`${environment.apiUrl}/AddRoleToAdmin`, {
      userId,
      roleId
    })
  }

  fetchAdminUsers() {
    return this.http.post<AdminUsersModel>(`${environment.apiUrl}/Admin/GetAdminUsers`, null)
  }

  generateAdminPassword(id: number) {
    return this.http.post<GenerateAdminPasswordModel>(`${environment.apiUrl}/Admin/GenerateAdminPassword?adminId=${id}`, null)
  }
}
