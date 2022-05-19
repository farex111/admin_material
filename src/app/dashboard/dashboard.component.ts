import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {UserModel} from "../shared/models/user.model";
import {LandingService} from "../landing/landing.service";
import {LoadingService} from "../shared/services/loading.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  userFirstName!: string;
  userLastName!: string;
  getUserDataSub!: Subscription;

  constructor(
    private userService: UserService,
    private landingService: LandingService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.userService.fetchUserPermissions()
    this.loadingService.start();
    this.getUserDataSub = this.userService.getUserData().subscribe((res: UserModel) => {
      this.loadingService.stop();
      this.userFirstName = res.data.firstName;
      this.userLastName = res.data.lastName;
    })
  }

  ngOnDestroy(): void {
    if (this.getUserDataSub) {
      this.getUserDataSub.unsubscribe();
    }
  }

  logOut() {
    this.landingService.logOut();
  }

}
