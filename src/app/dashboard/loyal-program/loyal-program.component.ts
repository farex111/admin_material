import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {LoadingService} from "../../shared/services/loading.service";
import {LoyalProgramService} from "./loyal-program.service";
import {GetLoyalProgramModel} from "../../shared/models/get-loyal-program.model";
import {MatDialog} from "@angular/material/dialog";
import {ShowFileComponent} from "./show-file/show-file.component";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {GetLoyalProgramFileTopUpsModel} from "../../shared/models/get-loyal-program-file-top-ups.model";

@Component({
  selector: 'app-loyal-program',
  templateUrl: './loyal-program.component.html',
  styleUrls: ['./loyal-program.component.scss']
})
export class LoyalProgramComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fileName', 'uploadDate', 'status', 'open', 'export'];
  dataSource!: Array<GetLoyalProgramModel>;

  getFilesSub!: Subscription;
  exportFileSub!: Subscription;

  constructor(
    private loadingService: LoadingService,
    private loyalProgramService: LoyalProgramService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getFiles();
  }

  ngOnDestroy(): void {
    if (this.getFilesSub) {
      this.getFilesSub.unsubscribe();
    }
    if (this.exportFileSub) {
      this.exportFileSub.unsubscribe();
    }
  }

  getFiles() {
    this.loadingService.start();
    this.getFilesSub = this.loyalProgramService.getFiles().subscribe((res: GetLoyalProgramModel[]) => {
      this.loadingService.stop();
      this.dataSource = res;
    })
  }

  getFileTopUps(element: GetLoyalProgramFileTopUpsModel) {
    if (element.status === 'Finished') {
      this.dialog.open(ShowFileComponent, {
        width: '80%',
        height: '70%',
        restoreFocus: false,
        data: {
          fileId: element.id
        }
      }).afterClosed().subscribe(() => {
        this.getFiles()
      })
    } else if (element.status === 'NotFound') {
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'შეცდომა',
          content: 'ჩანაწერები ვერ მოიძებნა',
          cancelText: 'დახურვა',
          warning: true
        }
      })
    }
  }

  exportFile(fileId: string) {
    this.loadingService.start();
    this.exportFileSub = this.loyalProgramService.exportFile(fileId).subscribe((res: string) => {
      this.loadingService.stop();
      if (res != null) {
        const blob = this.b64toBlob(res, "application/xlsx");
        const blobURL = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = blobURL;
        link.download = "File.xlsx";
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        setTimeout(function () {
          window.URL.revokeObjectURL(blobURL);
          link.remove();
        }, 100)
      } else {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: 'მსგავსი ინფორმაცია ვერ მოიძებნა',
            cancelText: 'დახურვა',
            warning: true
          }
        })
      }
    }, (err: any) => {
      this.dialog.open(DialogComponent, {
        width: '30%',
        restoreFocus: false,
        data: {
          title: 'შეცდომა',
          content: 'ვერ მოხერხრდა ფაილის დაექსპორტება',
          cancelText: 'დახურვა',
          warning: true
        }
      })
    })
  }

  b64toBlob = (b64Data: string, contentType: string, sliceSize: number = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  };

}
