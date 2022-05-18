import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {GeneralRequestService} from "./services/general-request.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private generalRequestService: GeneralRequestService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.generalRequestService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + token
        }
      })
    }
    return next.handle(req).pipe(tap(() => {
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            alert('User Unauthorized');
            this.generalRequestService.clearToken();
            this.router.navigate(['/landing/auth'])
          }
        }
      }
    ))
  }
}
