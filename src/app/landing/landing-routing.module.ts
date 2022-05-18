import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {NonAuthGuard} from "../shared/services/non-auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing/auth'
  },
  {
    path: "landing/auth",
    component: AuthComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}
