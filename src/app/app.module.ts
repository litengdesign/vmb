import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PremissionComponent } from './blocks/premission/premission.component';
import { SearchComponent } from './blocks/search/search.component';
import { DefaultComponent } from './layout/default/default.component'
import { OAuthModule } from 'angular-oauth2-oidc';
import { LogoComponent } from './blocks/logo/logo.component';
import { ArcgisMapComponent } from './blocks/arcgis-map/arcgis-map.component';
import { MainAvatarComponent } from './blocks/main-avatar/main-avatar.component';
import { MainNavigateComponent } from './blocks/main-navigate/main-navigate.component';
import { ProjectStatusPipPipe } from './pips/project-status-pip.pipe';
import { ProjectGradePipe } from './pips/project-grade.pipe';
import { PointerFloorPipe } from './pips/pointer-floor.pipe';
import { ProjectListComponent } from './blocks/project-list/project-list.component';
import { ProjectDetailComponent } from './blocks/project-detail/project-detail.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { SystemListComponent } from './blocks/system-list/system-list.component';
import { PopTemplateComponent } from './blocks/pop-template/pop-template.component';
import { AlertListComponent } from './blocks/alert-list/alert-list.component';
import { EchartsComponent } from './blocks/echarts/echarts.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HchartsComponent } from './blocks/hcharts/hcharts.component';
import { EmptyComponent } from './blocks/empty/empty.component';
import { TransformLunarPipe } from './pips/transform-lunar.pipe';
import { ProjectDetailMapComponent } from './blocks/project-detail-map/project-detail-map.component';
import { HighchartsComponent } from './blocks/highcharts/highcharts.component';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    PremissionComponent,
    SearchComponent,
    DefaultComponent,
    DashboardComponent,
    LogoComponent,
    ArcgisMapComponent,
    MainAvatarComponent,
    MainNavigateComponent,
    ProjectStatusPipPipe,
    ProjectGradePipe,
    PointerFloorPipe,
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectPageComponent,
    SystemListComponent,
    PopTemplateComponent,
    AlertListComponent,
    EchartsComponent,
    HchartsComponent,
    EmptyComponent,
    TransformLunarPipe,
    ProjectDetailMapComponent,
    HighchartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxEchartsModule,
    OAuthModule.forRoot(),
  ],
  entryComponents: [
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})

export class AppModule { 
  
}
