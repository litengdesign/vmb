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

import { NavComponent } from './blocks/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PremissionComponent } from './blocks/premission/premission.component';
import { SearchComponent } from './blocks/search/search.component';
import { DefaultComponent } from './layout/default/default.component'
import { OAuthModule } from 'angular-oauth2-oidc';
import { SettingsComponent } from './blocks/settings/settings.component';
import { LogoComponent } from './blocks/logo/logo.component';
import { ArcgisMapComponent } from './blocks/arcgis-map/arcgis-map.component';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PremissionComponent,
    SearchComponent,
    DefaultComponent,
    SettingsComponent,
    DashboardComponent,
    LogoComponent,
    ArcgisMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
  ],
  entryComponents: [
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})

export class AppModule { 
  
}
