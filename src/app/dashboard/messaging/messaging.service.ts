import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MessageInboxModel} from "../../shared/models/message-inbox.model";
import {MessageDetailsModel} from "../../shared/models/message-details.model";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  constructor(private http: HttpClient) {
  }

  fetchMessages(data: any) {
    return this.http.post<MessageInboxModel>(`${environment.apiUrl}/Admin/Message/Inbox`, data);
  }

  fetchMessageDetails(messageId: any) {
    return this.http.get<MessageDetailsModel>( `${environment.apiUrl}/Admin/Message/Details/${messageId}`)
  }
}
