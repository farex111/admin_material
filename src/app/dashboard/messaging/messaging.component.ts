import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from "../../shared/services/loading.service";
import {Subscription} from "rxjs";
import {MessagingService} from "./messaging.service";
import {MessageInboxItemsList, MessageInboxModel} from "../../shared/models/message-inbox.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {MessageThread, MessageThreadModel} from "../../shared/models/messageThread.model";
import {SearchComponent} from "./search/search.component";
import {FetchSearchedDataModel} from "../../shared/models/fetch-searched-data.model";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {
  clickChat: boolean = false;
  messages!: Array<MessageInboxItemsList>;
  messagesThread!: Array<MessageThread>
  totalMessages!: number;
  pageSize: number = 20;
  pageNumber!: number;
  selectedIndex!: number;

  messagesSub!: Subscription;
  messageThreadSub!: Subscription;
  searchMessageSub!: Subscription;

  constructor(
    private loadingService: LoadingService,
    private messagingService: MessagingService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.fetchMessages(1);
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe()
    }
    if (this.messageThreadSub) {
      this.messageThreadSub.unsubscribe();
    }
    if (this.searchMessageSub) {
      this.searchMessageSub.unsubscribe();
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  fetchMessages(pageNumber: number) {
    this.loadingService.start();
    const data = {
      isInbox: true,
      all: true,
      from: null,
      to: null,
      keyword: '',
      pageSize: this.pageSize,
      pageNumber: pageNumber,
    }
    this.messagesSub = this.messagingService.fetchMessages(data).subscribe((res: MessageInboxModel) => {
      this.loadingService.stop();
      if (res.errorCode) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          disableClose: true,
          data: {
            title: 'შეცდომა',
            content: res.message,
            cancelText: 'დახურვა',
            warning: true
          }
        })
      } else {
        this.messages = res.data.itemList;
        this.totalMessages = res.data.totalItemsCount;
      }
    })
  }


  fetchMessageThread(message: MessageInboxItemsList, index: number) {
    this.loadingService.start();
    this.setIndex(index);
    this.messageThreadSub = this.messagingService.fetchThread(message.id).subscribe((res: MessageThreadModel) => {
      this.loadingService.stop();
      this.messagesThread = res.data;
    })
  }

  openSearch() {
    this.dialog.open(SearchComponent, {
      width: '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      if (!res) {
        this.fetchMessages(1);
      } else {
        const data : FetchSearchedDataModel = {
          isInbox: res.isInbox,
          isSent: res.isSent,
          adminLogin: res.adminName ? res.adminName : null,
          from: res.from ? res.from : null,
          to: res.to ? res.to : null,
          personalNumber: res.idNumber ? res.idNumber : null,
          keyWord: res.searchWord ? res.searchWord : null,
          pageSize: this.pageSize,
          pageNumber: 1,
        };
        this.fetchSearchedData(data)
      }
    })
  }

  fetchSearchedData(data: FetchSearchedDataModel) {
    this.loadingService.start();
    this.searchMessageSub = this.messagingService.searchMessages(data).subscribe((res: any) => {
      this.loadingService.stop();
      this.messages = res.data.itemList
    })
  }
}
