import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent} from '../app/layout/default/default.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { ProjectListComponent } from './blocks/project-list/project-list.component';
import { ProjectDetailComponent } from './blocks/project-detail/project-detail.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { SystemListComponent } from './blocks/system-list/system-list.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full',
  },
  { path: 'home', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
  {
    path: 'integration',
    component: DefaultComponent,
    children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full',
      },
      {
        path: 'dashboard', component: DashboardComponent,
        data: {
          breadcrumb: '综合监控'
        },
        children: [
          {
            path: '', redirectTo: 'projectList', pathMatch: 'full',
          },
          {
            path: 'projectList', component: ProjectListComponent,
          },
          {
            path: 'projectDetail/:projectId', component: ProjectDetailComponent,
          }
        ],
      },
      {
        path: 'projectPage/:projectId', component: ProjectPageComponent,
        data: {
          breadcrumb: '项目页面'
        },
        children: [
          {
            path: '', redirectTo: 'systemList', pathMatch: 'full',
          },
          {
            path: 'systemList', component: SystemListComponent
          }
        ]
      }
    ],
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
