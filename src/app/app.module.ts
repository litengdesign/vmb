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
import { AngularEsriModule } from 'angular-esri-components';

import { NavComponent } from './blocks/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationComponent} from './pages/application/application.component';
import { PremissionComponent } from './blocks/premission/premission.component';
import { SearchComponent } from './blocks/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { DefaultComponent } from './layout/default/default.component'
import { OAuthModule } from 'angular-oauth2-oidc';
import { SettingsComponent } from './blocks/settings/settings.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ApplicationComponent,
    PremissionComponent,
    SearchComponent,
    LoginComponent,
    DefaultComponent,
    SettingsComponent,
    DashboardComponent
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
    AngularEsriModule,
    OAuthModule.forRoot(),
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
