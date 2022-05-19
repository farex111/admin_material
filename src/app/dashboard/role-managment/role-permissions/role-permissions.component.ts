import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
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
export class RolePermissionsComponent implements OnInit, OnDestroy {
  pickedRole!: Role;
  permissions!: Array<Permission>;
  roles!: Array<Role>

  addNewRoleSub!: Subscription;
  deleteRoleSub!: Subscription;
  addPermissionToRoleSub!: Subscription;
  getPermissionsSub!: Subscription;
  getRolesSub!: Subscription;

  constructor(
    private rolePermissionsService: RolePermissionsService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  ngOnDestroy(): void {
    if (this.addNewRoleSub) {
      this.addNewRoleSub.unsubscribe();
    }
    if (this.deleteRoleSub) {
      this.deleteRoleSub.unsubscribe();
    }
    if (this.addPermissionToRoleSub) {
      this.addPermissionToRoleSub.unsubscribe();
    }
    if (this.getPermissionsSub) {
      this.getPermissionsSub.unsubscribe();
    }
    if (this.getRolesSub) {
      this.getRolesSub.unsubscribe();
    }
  }

  getAllRoles() {
    this.loadingService.start();
    this.getRolesSub = this.rolePermissionsService.getAllRoles().subscribe((res: GetRolesModel) => {
      this.loadingService.stop()
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
      } else {
        this.roles = res.data;
        if (this.roles.length > 0) {
          this.pickRole(this.roles[0]);
        } else {
          this.pickRole(new Role())
        }
      }
    })
  }

  pickRole(role: Role) {
    if (this.pickedRole !== role) {
      this.pickedRole = role;
      this.getPermissions(role.id)
    }
  }

  getPermissions(id?: number) {
    this.loadingService.start();
    this.getPermissionsSub = this.rolePermissionsService.getPermissions(id).subscribe((res: GetPermissionsModel) => {
      this.loadingService.stop()
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
      } else {
        this.permissions = res.data;
      }
    })
  }

  openAddNewRoleDialog() {
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
        let permissionsIdArray: number[] = res.data.map((permissions: any) => permissions.id)
        if (res) {
          this.loadingService.start();
          this.addNewRoleSub = this.rolePermissionsService.addRole(res.roleName).subscribe((newRole: AddRoleModel) => {
            this.loadingService.stop();
            this.addPermissionToRole(newRole.data, permissionsIdArray);
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
        }
        else {
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

  openAddPermissionDialog(rolePermissions: Permission[], roleId: number) {
    this.loadingService.start();
    this.rolePermissionsService.getPermissions().subscribe((res: GetPermissionsModel) => {
      this.loadingService.stop();
      let temp = res.data;
      for (const rolePermission of rolePermissions) {
        temp = temp.filter((x: Permission) => x.id !== rolePermission.id)
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
        this.addPermissionToRole(roleId, newPermissions)
      });
    });
  }

  addPermissionToRole(roleId: number, newPermissions: number []) {
    this.loadingService.start();
    this.addPermissionToRoleSub = this.rolePermissionsService.addPermissionsToRole(roleId, newPermissions)
      .subscribe((res: AddPermissionToRoleModel) => {
        this.loadingService.stop();
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
  }

  deletePermission(roleId: number, permission: Permission) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      restoreFocus: false,
      disableClose: true,
      data: {
        content: 'ნამდვილად გსურთ უფლების წაშლა?',
        cancelText: 'არა',
        confirmText: 'კი',
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        let filteredPermissions = this.permissions.map((item: Permission) => item.id).filter((perId: number) => perId !== permission.id);
        this.addPermissionToRole(roleId, filteredPermissions);
      }
    })
  }
}
