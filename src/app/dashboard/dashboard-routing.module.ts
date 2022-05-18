import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {DashboardComponent} from "./dashboard.component";
import {ProfileComponent} from "./profile/profile.component";
import {RoleManagmentComponent} from "./role-managment/role-managment.component";
import {FaceRecognitionComponent} from "./face-recognition/face-recognition.component";
import {LoyalProgramComponent} from "./loyal-program/loyal-program.component";
import {MessagingComponent} from "./messaging/messaging.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/profile',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: 'users', component: UsersComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'role-management', component: RoleManagmentComponent},
      {path: 'face-recognition', component: FaceRecognitionComponent},
      {path: 'loyal-program', component: LoyalProgramComponent},
      {path: 'messaging', component: MessagingComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
