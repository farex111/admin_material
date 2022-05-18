import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleManagmentComponent} from './role-managment/role-managment.component';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from "./dashboard.component";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {SharedModule} from "../shared/shared.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialogModule} from '@angular/material/dialog';
import {ProfileComponent} from './profile/profile.component';
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {AddRoleToAdminComponent} from './role-managment/add-role-to-admin/add-role-to-admin.component';
import {RegisterAdminComponent} from './role-managment/register-admin/register-admin.component';
import {RolePermissionsComponent} from './role-managment/role-permissions/role-permissions.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FaceRecognitionComponent} from './face-recognition/face-recognition.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { LoyalProgramComponent } from './loyal-program/loyal-program.component';
import { AddNewRoleComponent } from './role-managment/role-permissions/add-new-role/add-new-role.component';
import { ShowFileComponent } from './loyal-program/show-file/show-file.component';
import { MessagingComponent } from './messaging/messaging.component';
import { AddPermissionsToRoleComponent } from './role-managment/role-permissions/add-permissions-to-role/add-permissions-to-role.component';


@NgModule({
  declarations: [
    DashboardComponent,
    RoleManagmentComponent,
    UsersComponent,
    ProfileComponent,
    AddRoleToAdminComponent,
    RegisterAdminComponent,
    RolePermissionsComponent,
    FaceRecognitionComponent,
    LoyalProgramComponent,
    AddNewRoleComponent,
    ShowFileComponent,
    MessagingComponent,
    AddPermissionsToRoleComponent,
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        SharedModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatListModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule
    ]
})
export class DashboardModule {
}
