import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {Subscription} from "rxjs";
import {UserModel} from "../shared/models/user.model";
import {LandingService} from "../landing/landing.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  loading!: boolean;
  userFirstName!: string;
  userLastName!: string;
  loadingSub!: Subscription;

  constructor(private userService: UserService, private landingService: LandingService) {
  }

  ngOnInit(): void {
    this.loadingSub = this.userService.loading.subscribe((res: boolean) => {
      this.loading = res
    });
    this.userService.getUserData().subscribe((res: UserModel) => {
      this.userFirstName = res.data.firstName;
      this.userLastName = res.data.lastName;
    })
  }

  logOut() {
    this.landingService.logOut();
  }
}
