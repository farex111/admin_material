import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {AuthModel} from "../shared/models/auth.model";
import {GeneralRequestService} from "../shared/services/general-request.service";

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  displayUserName!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private generalRequestService: GeneralRequestService
  ) {
  }

  authorizeUser(userName: string, password: string) {
    this.displayUserName = userName;
    return this.http.post<AuthModel>(`${environment.apiUrl}/api/v1/Auth`, {
      userName,
      password
    })
  }

  logOut() {
    this.generalRequestService.clearToken();
    this.router.navigate(['/landing/auth'])
  }
}
