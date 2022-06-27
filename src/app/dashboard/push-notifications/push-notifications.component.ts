import {Component, OnDestroy, OnInit} from '@angular/core';
import {PushNotificationsData, PushNotificationsModel} from "../../shared/models/push-notification.model";
import {PushNotificationService} from "./push-notification.service";
import {Subscription} from "rxjs";
import {LoadingService} from "../../shared/services/loading.service";

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent implements OnInit, OnDestroy {
  pushNotificationsArray!: Array<PushNotificationsData>;

  fetchPushNotificationsSub!: Subscription;

  constructor(
    private pushNotificationService: PushNotificationService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.fetchPushNotifications();
  }

  ngOnDestroy(): void {
    if (this.fetchPushNotificationsSub) {
      this.fetchPushNotificationsSub.unsubscribe();
    }
  }

  fetchPushNotifications() {
    this.loadingService.start();
    this.fetchPushNotificationsSub = this.pushNotificationService.fetchNotifications()
      .subscribe((res: PushNotificationsModel) => {
        this.loadingService.stop();
        this.pushNotificationsArray = res.data
      })
  }

  getRefresh(e: boolean) {
    if (e) {
      this.fetchPushNotifications();
    }
  }


}
