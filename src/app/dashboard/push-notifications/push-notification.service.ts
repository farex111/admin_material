import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PushNotificationsModel} from "../../shared/models/push-notification.model";

@Injectable({
  providedIn: "root"
})
export class PushNotificationService {
  API_URL: string = 'http://10.195.105.101:5033/api/v1/PushNotifications';

  constructor(private http: HttpClient) {
  }

  fetchNotifications() {
    return this.http.get<PushNotificationsModel>(`${this.API_URL}`);
  }

  verifyNotification(id: number) {
    return this.http.post(`${this.API_URL}/${id}/verify`, {
      id
    });
  }

  deleteNotification(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
