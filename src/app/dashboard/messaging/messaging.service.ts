import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MessageInboxModel} from "../../shared/models/message-inbox.model";
import {MessageDetailsModel} from "../../shared/models/message-details.model";
import {MessageThreadModel} from "../../shared/models/messageThread.model";
import {SearchedDataModel} from "../../shared/models/searched-data.model";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  constructor(private http: HttpClient) {
  }

  fetchMessages(data: any) {
    return this.http.post<MessageInboxModel>(`${environment.apiUrl}/Admin/Message/Inbox`, data);
  }

  fetchMessageDetails(messageId: number) {
    return this.http.get<MessageDetailsModel>(`${environment.apiUrl}/Admin/Message/Details/${messageId}`)
  }

  fetchThread(messageId: number) {
    return this.http.get<MessageThreadModel>(`${environment.apiUrl}/Admin/Message/Thread/${messageId}`);
  }

  searchMessages(searchData: any) {
    return this.http.post<SearchedDataModel>(`${environment.apiUrl}/Admin/Message/Search`, searchData);
  }

  sendMessageToOne(data: any) {
    return this.http.post(`${environment.apiUrl}/Admin/Message/SendToOne`, data);
  }
}
