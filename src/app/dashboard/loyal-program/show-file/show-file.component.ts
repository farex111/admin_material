import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GetLoyalProgramFileTopUpsModel} from "../../../shared/models/get-loyal-program-file-top-ups.model";
import {MatTableDataSource} from "@angular/material/table";
import {LoyalProgramService} from "../loyal-program.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss']
})
export class ShowFileComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'mobile', 'status', 'provider'];
  dataSource!: MatTableDataSource<GetLoyalProgramFileTopUpsModel>;
  getFileToUpsSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ShowFileComponent>, @Inject(MAT_DIALOG_DATA)
    public data: { fileId: string },
    private loyalProgramService: LoyalProgramService
  ) {
  }

  ngOnInit(): void {
    this.getFileToUpsSub = this.loyalProgramService.getFileTopUps(this.data.fileId).subscribe((res: GetLoyalProgramFileTopUpsModel[]) => {
      this.dataSource = new MatTableDataSource<GetLoyalProgramFileTopUpsModel>(res);
    })
  }

  ngOnDestroy(): void {
    if (this.getFileToUpsSub) {
      this.getFileToUpsSub.unsubscribe()
    }
  }

}
