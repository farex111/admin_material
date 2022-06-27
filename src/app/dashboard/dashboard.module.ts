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
import {LoyalProgramComponent} from './loyal-program/loyal-program.component';
import {AddNewRoleComponent} from './role-managment/role-permissions/add-new-role/add-new-role.component';
import {ShowFileComponent} from './loyal-program/show-file/show-file.component';
import {MessagingComponent} from './messaging/messaging.component';
import {AddPermissionsToRoleComponent} from './role-managment/role-permissions/add-permissions-to-role/add-permissions-to-role.component';
import { SearchComponent } from './messaging/search/search.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { CreateComponent } from './messaging/create/create.component';
import { ComposeComponent } from './messaging/create/compose/compose.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { HistoryComponent } from './push-notifications/history/history.component';
import { SavedComponent } from './push-notifications/saved/saved.component';
import { NewNotificationComponent } from './push-notifications/new-notification/new-notification.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatRadioModule} from "@angular/material/radio";
import { EditNotificationComponent } from './push-notifications/saved/edit-notification/edit-notification.component';
import {MatSelectModule} from "@angular/material/select";


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
    SearchComponent,
    CreateComponent,
    ComposeComponent,
    PushNotificationsComponent,
    HistoryComponent,
    SavedComponent,
    NewNotificationComponent,
    EditNotificationComponent,
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
        FormsModule,
        MatSlideToggleModule,
        MatStepperModule,
        MatRadioModule,
        MatSelectModule
    ]
})
export class DashboardModule {
}
