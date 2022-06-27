import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      searchWord: ['', [Validators.minLength(3)]],
      searchIdNumber: ['', [Validators.minLength(11)]],
      searchAdminName: ['', [Validators.minLength(3)]],
      isSent: [true],
      isInbox: [false],
      from: [null],
      to: [null]
    })
  }

  submitSearch() {
    return {
      searchWord: this.searchForm.controls['searchWord'].value,
      idNumber: this.searchForm.controls['searchIdNumber'].value,
      adminName: this.searchForm.controls['searchAdminName'].value,
      isSent: this.searchForm.controls['isSent'].value,
      isInbox: this.searchForm.controls['isInbox'].value,
      from: this.searchForm.controls['from'].value,
      to: this.searchForm.controls['to'].value,
    }
  }
}
