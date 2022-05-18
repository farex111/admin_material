import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Subscription} from "rxjs";
import {environment} from "../../../environments/environment";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // @ts-ignore
  permissions: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(undefined);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  userSub!: Subscription;

  constructor(private http: HttpClient) {
  }

  getUserData() {
    return this.http.post<UserModel>(`${environment.apiUrl}/GetUserData`, null, {})
  }

  fetchUserPermissions() {
    this.userSub = this.getUserData().subscribe((res: any) => {
      this.permissions.next(res.data.permissions);
      this.loading.next(false);
    })
  }

  getUserPermissions() {
    return this.permissions;
  }
}
