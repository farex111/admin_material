import {Injectable} from "@angular/core";
import {CanActivate, Router,} from "@angular/router";
import {GeneralRequestService} from "./general-request.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private generalRequestService: GeneralRequestService
  ) {
  }


  canActivate(): boolean {
    if (this.generalRequestService.getToken()) {
      return true;
    } else {
      this.router.navigate(['landing/auth']);
      return false;
    }
  }

}
