import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {LandingService} from "../landing.service";
import {GeneralRequestService} from "../../shared/services/generalRequest.service";
import {Router} from "@angular/router";
import {AuthModel} from "../../shared/models/auth.model";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  hide: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  authorizationForm!: FormGroup;
  authorizeUserSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private landingService: LandingService,
    private generalRequestService: GeneralRequestService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.authorizationForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submitForm() {
    this.authorizeUser();
  }

  authorizeUser() {
    const userName = this.authorizationForm.controls['userName'].value;
    const password = this.authorizationForm.controls['password'].value;
    this.authorizeUserSub = this.landingService
      .authorizeUser(userName, password)
      .subscribe((res: AuthModel) => {
        console.log(res)
        if (res.data && res.data.token) {
          this.generalRequestService.setToken(res.data.token);
          this.router.navigate(['/']);
        } else {
          this.error = true;
          this.errorMessage = res.errorCode;
        }
      })
  }
}
