import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent} from '../app/pages/application/application.component';
import { LoginComponent} from '../app/pages/login/login.component';
import { DefaultComponent} from '../app/layout/default/default.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard/v1', component: DashboardComponent,
        data: {
          breadcrumb: '控制面板'
        }
      },
      { path: 'application', component: ApplicationComponent,
        data: {
          breadcrumb: '应用程序管理'
        }
      },
    ],
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
