import {Directive, OnInit, Input, ViewContainerRef, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from "../services/user.service";

@Directive({
  selector: '[userHasPermission]',
})
export class HasPermissionDirective implements OnInit {
  @Input() userHasPermission!: Array<string>;

  userDataSub!: Subscription;
  permissions!: Array<string>;

  isVisible: boolean = false;
  viewCondition: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getPermissionList();
  }

  getPermissionList() {
    this.userDataSub = this.userService.permissions.subscribe((res: Array<string>) => {
      this.permissions = res;
      if (this.permissions !== undefined) {
        if (this.userHasPermission[0] === 'All') {
          this.viewCondition = this.hasAll(this.permissions, this.userHasPermission);
        }
        if (this.userHasPermission[0] === 'Any') {
          this.viewCondition = this.hasAny(this.permissions, this.userHasPermission);
        }
        if (this.viewCondition) {
          if (!this.isVisible) {
            this.isVisible = true;
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      }
    });
  }

  hasAll(permissionArray: Array<string>, neededPermissionsArray: Array<string>) {
    let hasAllPermission = true;
    let j = 1;
    while (hasAllPermission && j < neededPermissionsArray.length) {
      if (permissionArray.includes(neededPermissionsArray[j])) {
        j++;
      } else {
        hasAllPermission = false;
      }
    }
    return hasAllPermission;
  }

  hasAny(permissionArray: Array<string>, neededPermissionsArray: Array<string>) {
    let hasAnyPermission = false;
    let j = 1;
    while (!hasAnyPermission && j < neededPermissionsArray.length) {
      if (permissionArray.includes(neededPermissionsArray[j])) {
        hasAnyPermission = true;
      } else {
        j++;
      }
    }
    return hasAnyPermission;
  }
}
