import {Component, OnInit} from '@angular/core';
import {finalize, map, Observable, Subject, Subscription, tap} from "rxjs";
import {RolePermissionsService} from "./role-permissions.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {GetRolesModel, Role} from "../../../shared/models/get-roles.model";
import {GetPermissionsModel, Permission} from "../../../shared/models/get-permissions.model";
import {LoadingService} from "../../../shared/services/loading.service";
import {AddNewRoleComponent} from "./add-new-role/add-new-role.component";
import {AddRoleModel} from "../../../shared/models/add-role.model";
import {DeleteRoleModel} from "../../../shared/models/delete-role.model";
import {AddPermissionsToRoleComponent} from "./add-permissions-to-role/add-permissions-to-role.component";
import {AddPermissionToRoleModel} from "../../../shared/models/add-permission-to-role.model";

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit {
  pickedRole!: Role;
  permissions$!: Subject<Array<Permission>>;
  roles$!: Observable<Array<Role>>

  addNewRoleSub!: Subscription;
  deleteRoleSub!: Subscription;
  addPermissionToRoleSub!: Subscription;

  constructor(
    private rolePermissionsService: RolePermissionsService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.loadingService.start();
    this.roles$ = this.rolePermissionsService.getAllRoles().pipe(tap((res: GetRolesModel) => {
      if (res.errorCode) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: 'res.errorCode',
            cancelText: 'დახურვა',
            warning: true
          }
        });
      }
    }), map(res => res.data), finalize(() => this.loadingService.stop()));
  }

  pickRole(role: Role) {
    if (this.pickedRole !== role) {
      this.pickedRole = role;
      this.getPermissions(role.id)
    }
  }

  getPermissions(id?: number) {
    this.loadingService.start();
    this.permissions$ = this.rolePermissionsService.getPermissions(id).pipe(tap((res: GetPermissionsModel) => {
      if (res.errorCode) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: 'res.errorCode',
            cancelText: 'დახურვა',
            warning: true
          }
        });
      }
    }), map(res => res.data), finalize(() => this.loadingService.stop())) as Subject<any>
  }

  addNewRole() {
    this.loadingService.start();
    this.rolePermissionsService.getPermissions().subscribe((res: GetPermissionsModel) => {
      this.loadingService.stop();
      this.dialog.open(AddNewRoleComponent, {
        width: '50%',
        height: '70%',
        restoreFocus: false,
        disableClose: true,
        data: {
          permissions: res.data
        }
      }).afterClosed().subscribe((res: any) => {
        this.loadingService.start();
        if (res.roleName) {
          this.addNewRoleSub = this.rolePermissionsService.addRole(res.roleName).subscribe((res: AddRoleModel) => {
            this.loadingService.stop();
            this.getAllRoles();
            if (res.errorCode) {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: res.errorCode,
                  warning: true,
                  cancelText: 'დახურვა'
                }
              });
            }
          });
        } else {
          this.getAllRoles();
        }
      });
    });
  }

  deleteRole(roleId: number) {
    this.loadingService.start();
    this.deleteRoleSub = this.rolePermissionsService.deleteRole(roleId).subscribe((res: DeleteRoleModel) => {
      this.loadingService.stop();
      if (!res.errorCode) {
        this.getAllRoles();
        this.permissions$.next([])
      } else {
        this.dialog.open(DialogComponent, {
          width: '30%',
          restoreFocus: false,
          data: {
            title: 'შეცდომა',
            content: res.errorCode,
            warning: true,
            cancelText: 'დახურვა'
          }
        });
      }
    });
  }

  addPermissionsToRole(rolePermissions: Permission[], roleId: number) {
    this.loadingService.start();
    this.rolePermissionsService.getPermissions().subscribe((res: GetPermissionsModel) => {
      this.loadingService.stop();
      let temp = res.data;
      for (const rolePermission of rolePermissions) {
        temp = temp.filter((x) => x.id !== rolePermission.id)
      }
      this.dialog.open(AddPermissionsToRoleComponent, {
        width: '50%',
        height: '70%',
        disableClose: true,
        data: {
          permissions: temp
        }
      }).afterClosed().subscribe((res: Permission[]) => {
        const mappedTemp = res.map((x: Permission) => x.id);
        const oldPermissions = rolePermissions.map((x: Permission) => x.id);
        const newPermissions = [...oldPermissions, ...mappedTemp];
        this.addPermissionToRoleSub = this.rolePermissionsService.addPermissionsToRole(roleId, newPermissions)
          .subscribe((res: AddPermissionToRoleModel) => {
            if (!res.errorCode) {
              this.getPermissions(roleId);
            } else {
              this.dialog.open(DialogComponent, {
                width: '30%',
                restoreFocus: false,
                data: {
                  title: 'შეცდომა',
                  content: res.errorCode,
                  cancelText: 'დახურვა',
                  warning: true
                }
              });
            }
          });
      });
    });
  }

  deletePermission(roleId: number, permission: Permission) {
    this.loadingService.start();
    this.rolePermissionsService.getPermissions(roleId).subscribe((res: GetPermissionsModel) => {
      this.loadingService.stop();
      let temp = res.data;

      for (const per of temp) {
        temp = temp.filter((x: Permission) => x.id !== permission.id)
      }
    });
  }
}
