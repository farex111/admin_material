import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingService} from "../../../shared/services/loading.service";
import {UsersService} from "../../users/users.service";
import {Subscription} from "rxjs";
import {User, UsersListModel} from "../../../shared/models/user-list.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {ComposeComponent} from "./compose/compose.component";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  searchForm!: FormGroup;
  letterForm!: FormGroup;

  fetchUsersSub!: Subscription;
  displayedColumns: string[] = ['userName', 'idNumber', 'mobile', 'firstName', 'lastName', 'new'];
  dataSource!: Array<User>;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private userService: UsersService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  ngOnDestroy(): void {
    if (this.fetchUsersSub) {
      this.fetchUsersSub.unsubscribe()
    }
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      searchWord: ['']
    })
  }

  submitSearch() {
    const searchValue = this.searchForm.controls['searchWord'].value;
    this.fetchUsers(searchValue)
  }

  fetchUsers(searchByValue: string) {
    this.loadingService.start();
    this.fetchUsersSub = this.userService.fetchUsers(searchByValue).subscribe((res: UsersListModel) => {
      this.loadingService.stop();
      if (res.errorCode) {
        this.dialog.open(DialogComponent, {
          width:'30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: res.errorCode,
            cancelText: 'დახურვა',
            warning: true
          }
        })
      } else {
        this.dataSource = res.data
      }
    })
  }


  sendToAll() {
    this.dialog.open(ComposeComponent, {
      width: '50%',
      autoFocus: false,
      disableClose: true
    })
  }
}
