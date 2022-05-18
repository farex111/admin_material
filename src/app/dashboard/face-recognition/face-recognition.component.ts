import {Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FaceRecognitionService} from "./face-recognition.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {FaceRecognition, FaceRecognitionModel} from "../../shared/models/face-recognition.model";
import {LoadTypeEnum} from "../../shared/enums/load-type.enum";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {LoadingService} from "../../shared/services/loading.service";

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss']
})
export class FaceRecognitionComponent implements OnInit, OnDestroy {
  pageSize: number = 5;
  pageNumber: number = 1;
  pageCount!: number;
  searchForm!: FormGroup;
  fromDate!: Date;
  loading: boolean = false;
  openImageViewerWindow: boolean = false;
  pickedPerson!: FaceRecognition;
  imageViewGallery: { text: string, image: string } [] = [];

  displayedColumns: string[] = ['personalId', 'name', 'loanType', 'docNumber', 'matchLevel', 'success', 'date', 'images'];
  dataSource!: MatTableDataSource<FaceRecognition>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userSub!: Subscription;
  faceRecognitionSub!: Subscription;

  constructor(
    private faceRecognitionService: FaceRecognitionService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userSub = this.userService.permissions.subscribe((res: string[]) => {
      if (res != undefined) {
        if (!res.includes("Permissions.GetFaceRecognitionData")) {
          this.router.navigate(['role-management'])
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.faceRecognitionSub) {
      this.faceRecognitionSub.unsubscribe();
    }
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      personalNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    })
  }

  returnEnumValue(loanType: number) {
    switch (loanType) {
      case 1:
        return LoadTypeEnum.fastLoan;
        break;
      case 2:
        return LoadTypeEnum.studentLoan;
        break;
      case 3:
        return LoadTypeEnum.installment;
        break;
      case 4:
        return LoadTypeEnum.carLoan;
        break;
      default:
        return LoadTypeEnum.unknown;
        break;
    }
  }

  dateToString(date: Date) {
    return (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
      "-" + (date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString()) +
      "-" + date.getFullYear().toString();
  }

  fetchFaceRecognitionData(personalNumber: string, fromDate: Date, toDate: Date, pageSize: number, pageNumber: number) {
    this.loadingService.start();
    let start = this.dateToString(fromDate)
    let end = this.dateToString(toDate)

    this.faceRecognitionSub = this.faceRecognitionService
      .fetchFaceRecognitionData(personalNumber, start, end, pageSize, pageNumber)
      .subscribe((res: FaceRecognitionModel) => {
        this.loadingService.stop();
        this.dataSource = new MatTableDataSource<FaceRecognition>(res.data.faceRecognitionList);
        this.dataSource.paginator = this.paginator;
        this.pageCount = res.data.pageCount;
        this.pageNumber = pageNumber;
      })
  }

  submitForm() {
    const personalNumber = this.searchForm.controls['personalNumber'].value;
    const startDate = this.searchForm.controls['fromDate'].value;
    const endDate = this.searchForm.controls['toDate'].value;
    if (this.searchForm.valid) {
      this.fetchFaceRecognitionData(personalNumber, startDate, endDate, 20, 1)
    }
  }

  openImageViewer(person: FaceRecognition, imageType: string) {
    this.pickedPerson = person;
    this.imageViewGallery.push({
      text: `${this.pickedPerson.name} ${this.pickedPerson.surName} - Front image`,
      image: this.pickedPerson.idCardFrontImage
    });
    this.imageViewGallery.push({
      text: `${this.pickedPerson.name} ${this.pickedPerson.surName} - Selfie image`,
      image: this.pickedPerson.selfieImage
    });
    this.imageViewGallery.push({
      text: `${this.pickedPerson.name} ${this.pickedPerson.surName} - Back image`,
      image: this.pickedPerson.idCardBackImage
    });
    if (imageType === 'front') {
      this.imageViewGallery.splice(0, 0, this.imageViewGallery.splice(0, 1)[0])
    } else if (imageType === 'selfie') {
      this.imageViewGallery.splice(0, 0, this.imageViewGallery.splice(1, 1)[0])
    } else if (imageType === 'back') {
      this.imageViewGallery.splice(0, 0, this.imageViewGallery.splice(2, 1)[0]);
    }
    this.openImageViewerWindow = true;
  }
}
