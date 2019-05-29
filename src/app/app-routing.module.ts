import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard'

const routes: Routes = [
{
  path:'',
  component : LoginComponent
},
{
  path: 'dashboard',
  canActivate : [AuthGuard],
  loadChildren: './dashboard/dashboard.module#DashboardModule'
},
{
  path: 'administration',
  canActivate : [AuthGuard],
  loadChildren: './administration/administration.module#AdministrationModule'
},
{
  path: 'reports',
  canActivate : [AuthGuard],
  loadChildren: './reports/reports.module#ReportsModule'
},
{
  path: '**',
  loadChildren: './dashboard/dashboard.module#DashboardModule'
},
{
  path: '',
  redirectTo: '',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
