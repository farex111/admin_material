import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserModel} from "../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {
  }

  getUserData() {
    return this.http.post<UserModel>(`${environment.apiUrl}/GetUserData`, null, {})
  }

  setUserDataToLocal(data: any) {
    localStorage.setItem('userdata', JSON.stringify(data))
  }

  getUserDataFromLocal(){
    // @ts-ignore
    return JSON.parse(localStorage.getItem('userdata'))
  }

  deleteUserDaraFromLocal(){
    localStorage.removeItem('userdata')
  }
}
