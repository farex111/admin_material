import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PushNotificationsData} from "../../../shared/models/push-notification.model";
import {PushNotificationService} from "../push-notification.service";
import {Subscription} from "rxjs";
import {LoadingService} from "../../../shared/services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {EditNotificationComponent} from "./edit-notification/edit-notification.component";

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit, OnChanges {
  @Input() pushNotificationsArray!: Array<PushNotificationsData>
  displayedColumns: string[] = ['name', 'title', 'message', 'sendTime', 'deliveryTime', 'status', 'type', 'buttons'];

  @Output() refreshNotificationsArray: EventEmitter<boolean> = new EventEmitter<boolean>();

  verifyNotificationSub!: Subscription;
  deleteNotificationSub!: Subscription;

  constructor(
    private pushNotificationsService: PushNotificationService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pushNotificationsArray'] && changes['pushNotificationsArray'].currentValue) {
      this.pushNotificationsArray = this.pushNotificationsArray.filter(status => status.status === 2 || status.status === 4);
    }
  }

  verifyNotification(id: number) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ შეტყობინების დადასტურება?',
        cancelText: 'არა',
        confirmText: 'დიახ'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.loadingService.start();
        this.verifyNotificationSub = this.pushNotificationsService.verifyNotification(id).subscribe(() => {
          this.loadingService.stop();
          this.refreshNotificationsArray.emit(true);
        })
      } else {
        this.refreshNotificationsArray.emit(true);
      }
    })
  }

  deleteNotification(id: number) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      data: {
        content: 'ნამდვილად გსურთ შეტყობინების წაშლა?',
        cancelText: 'არა',
        confirmText: 'დიახ',
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.loadingService.start();
        this.deleteNotificationSub = this.pushNotificationsService.deleteNotification(id).subscribe(() => {
          this.loadingService.stop();
          this.refreshNotificationsArray.emit(true);
        })
      } else {
        this.refreshNotificationsArray.emit(true);
      }
    })
  }

  editNotification(notification: PushNotificationsData) {
    this.dialog.open(EditNotificationComponent, {
      width: '50%',
      restoreFocus: false,
      data: {
        canVerify: notification.canVerify,
        createdDate: notification.createdDate,
        deliveryDate: notification.deliveryDate,
        id: notification.id,
        isForLegalPersons: notification.isForLegalPersons,
        name: notification.name,
        status: notification.status,
        text: notification.text,
        title: notification.title,
        type: notification.type,
        updateDate: notification.updateDate,
      }
    })
  }
}
