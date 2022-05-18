import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NonAuthGuard} from "./shared/services/non-auth.guard";
import {AuthGuard} from "./shared/services/auth.guard";

const routes: Routes = [
  {
    path: '',
    canActivate:[NonAuthGuard],
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule)
  },
  {
    path: 'dashboard',
    canActivate:[AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
