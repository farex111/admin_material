import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {AddRoleToAdminService} from "./add-role-to-admin.service";
import {AdminUser, AdminUsersModel} from "../../../shared/models/get-admin-users.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {GetRolesModel} from "../../../shared/models/get-roles.model";
import {RolePermissionsService} from "../role-permissions/role-permissions.service";
import {SelectionDialogComponent} from "../../../shared/components/selection-dialog/selection-dialog.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {LoadingService} from "../../../shared/services/loading.service";
import {GenerateAdminPasswordModel} from "../../../shared/models/generate-admin-password.model";

@Component({
  selector: 'app-add-role-to-admin',
  templateUrl: './add-role-to-admin.component.html',
  styleUrls: ['./add-role-to-admin.component.scss']
})
export class AddRoleToAdminComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  adminUsersSub!: Subscription;
  generateNewPassword!: Subscription;
  rolesSub!: Subscription;
  updateRoleSub!: Subscription;
  displayedColumns: string[] = ['name', 'userName', 'role', 'role-change', 'reset-password'];
  dataSource!: MatTableDataSource<AdminUser>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('table', {read: ElementRef}) table!: ElementRef;

  constructor(
    private addRoleToAdminService: AddRoleToAdminService,
    private dialog: MatDialog,
    private rolePermissionsService: RolePermissionsService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.adminUsersSub = this.addRoleToAdminService.fetchAdminUsers().subscribe((res: AdminUsersModel) => {
      this.loadingService.stop();
      this.dataSource = new MatTableDataSource<AdminUser>(res.data);
      this.dataSource.paginator = this.paginator;
    })
  }

  ngOnDestroy(): void {
    if (this.adminUsersSub) {
      this.adminUsersSub.unsubscribe();
    }
    if (this.generateNewPassword) {
      this.generateNewPassword.unsubscribe();
    }
    if (this.rolesSub) {
      this.rolesSub.unsubscribe();
    }
    if (this.updateRoleSub) {
      this.updateRoleSub.unsubscribe();
    }
  }

  submitAdminNewPassword(admin: AdminUser) {
    this.loadingService.start();
    this.generateNewPassword = this.addRoleToAdminService.generateAdminPassword(admin.id).subscribe((res: GenerateAdminPasswordModel) => {
      this.loadingService.stop();
      if (!res.data) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: 'res.message',
            cancelText: 'დახურვა',
            warning: true
          }
        });
      } else {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'წარმატება',
            content: 'პაროლი წარმატებით გაიგზავნა',
            cancelText: 'დახურვა',
            success: true
          }
        })
      }
    })
  }

  onAddRole(role: AdminUser) {
    this.loadingService.start();
    this.rolesSub = this.rolePermissionsService.getAllRoles().subscribe((res: GetRolesModel) => {
      this.loadingService.stop();
      if (!res.errorCode) {
        this.dialog.open(SelectionDialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            roles: res.data,
            title: `${role.firstName} ${role.lastName}`,
            role: role.connectedRoles[0].name
          }
        }).afterClosed().subscribe((res: number) => {
          this.loadingService.start();
          this.updateRoleSub = this.addRoleToAdminService.addRoleToUser(role.id, res).subscribe((res: any) => {
            this.loadingService.stop();
            if (res.errorCode) {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: res.message,
                  cancelText: 'დახურვა',
                  warning: true
                }
              });
            } else {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'წარმატება',
                  content: 'როლი წარმატებით შეიცვალა',
                  cancelText: 'დახურვა',
                  success: true
                }
              })
            }
          })
        })
      } else {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: 'res.errorCode',
            cancelText: 'დახურვა',
            warning: true
          }
        })
      }
    })
  }

  scrollToTop() {
    this.table.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
  }
}
