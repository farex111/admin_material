import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {GetRolesModel} from "../../../shared/models/get-roles.model";
import {GetPermissionsModel} from "../../../shared/models/get-permissions.model";
import {AddRoleModel} from "../../../shared/models/add-role.model";
import {DeleteRoleModel} from "../../../shared/models/delete-role.model";
import {AddPermissionToRoleModel} from "../../../shared/models/add-permission-to-role.model";

@Injectable({
  providedIn: 'root'
})
export class RolePermissionsService {
  constructor(private http: HttpClient) {
  }

  getAllRoles() {
    return this.http.get<GetRolesModel>(`${environment.apiUrl}/GetRoles`)
  }

  getPermissions(id?: any) {
    const paramsSet = new HttpParams().set('roleId', id);
    return this.http.get<GetPermissionsModel>(`${environment.apiUrl}/GetAllPermissions`, {
      params: paramsSet
    })
  }

  addPermissionsToRole(roleId: number, permissionIdList: number[]) {
    return this.http.post<AddPermissionToRoleModel>(`${environment.apiUrl}/AddPermissionsToRole`, {
      roleId,
      permissionIdList
    })
  }

  addRole(name: string) {
    const paramsSet = new HttpParams().set('name', name);
    return this.http.post<AddRoleModel>(`${environment.apiUrl}/AddRole`, null,{
      params: paramsSet
    })
  }

  deleteRole(id: number) {
    const paramsSet = new HttpParams().set('roleId', id);
    return this.http.post<DeleteRoleModel>(`${environment.apiUrl}/DeleteRole`, null, {
      params: paramsSet
    })
  }
}
