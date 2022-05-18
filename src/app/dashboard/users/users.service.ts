import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UsersListModel} from "../../shared/models/user-list.model";
import {BlockModel, UnblockModel} from "../../shared/models/blockandunblock.model";
import {GenerateNewPasswordModel} from "../../shared/models/generate-newpassword.model";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  fetchUsers(searchByValues: string) {
    let paramsSet = new HttpParams();
    if (searchByValues) {
      paramsSet = paramsSet.set('searchByValue', searchByValues);
    }
    return this.http.get<UsersListModel>(`${environment.apiUrl}/Admin/searchUsers`, {
      params: paramsSet,
    })
  }

  blockUser(userId: number) {
    return this.http.post<BlockModel>(`${environment.apiUrl}/Admin/BlockSsoUser`, {
      userId
    });
  }

  blockCompany(userId: number, companyId: number, reason: string) {
    return this.http.post<BlockModel>(`${environment.apiUrl}/api/v1/Company/user/block`, {
      companyId,
      userId,
      reason
    });
  }

  unblockUser(userId: number) {
    return this.http.post<UnblockModel>(`${environment.apiUrl}/Admin/UnblockSsoUser`, null, {
      params: {
        userId
      }
    })
  }

  unblockCompany(userId: number, companyId: number, reason: string) {
    return this.http.post<UnblockModel>(`${environment.apiUrl}/api/v1/Company/user/unblock`, {
      userId,
      companyId,
      reason
    })
  }

  generateNewPassword(userId: number) {
    return this.http.post<GenerateNewPasswordModel>(`${environment.apiUrl}/Admin/GenerateNewPasswordSso`, null, {
      params: {
        userId
      }
    })
  }

}
