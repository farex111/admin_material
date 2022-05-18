import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GeneralRequestService {
  setToken(token: string) {
    localStorage.setItem('TOKEN', token)
  }

  getToken() {
    return localStorage.getItem('TOKEN')
  }

  clearToken() {
    localStorage.removeItem('TOKEN')
  }
}
