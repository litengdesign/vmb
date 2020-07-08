import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { ProjectInfoComponent } from './components/project-info/project-info.component';
import { AutomonitorAlertComponent } from './components/automonitor-alert/automonitor-alert.component';
import { VolumeBoardComponent } from './components/volume-board/volume-board.component';
import { PopTemplateComponent } from './components/pop-template/pop-template.component';
import { EchartsComponent } from './components/echarts/echarts.component';
import { EmptyComponent } from './components/empty/empty.component';
import { HighchartsComponent } from './components/highcharts/highcharts.component';
import { HchartsComponent } from './components/hcharts/hcharts.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [HeaderComponent, MapComponent, EchartsComponent, PopTemplateComponent, EmptyComponent, HighchartsComponent , HchartsComponent , DashboardComponent, CardTitleComponent, ProjectInfoComponent, AutomonitorAlertComponent, VolumeBoardComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModule { }
