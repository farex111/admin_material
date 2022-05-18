import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingService} from "../../shared/services/loading.service";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {
  searchForm!: FormGroup;
  pageSize: number = 20;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      searchWord: ['', [Validators.minLength(3)]],
      searchIdNumber: [''],
      searchAdminName: [''],
      isSent: [true],
      isInbox: [false],
      from: [null],
      to: [null]
    })
  }

  fetchMessages(pageNumber?: any, pickedMess?: any, selectFirst?: boolean) {

    const data = {
      isInbox: true,
      all: true,
      from: this.searchForm.controls['from'].value,
      to: this.searchForm.controls['to'].value,
      keyword: this.searchForm.controls['searchWord'].value,
      pageSize: this.pageSize,
      pageNumber,
    };
  }
}
