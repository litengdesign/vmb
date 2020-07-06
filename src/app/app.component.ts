import { Component } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';
  constructor(private authService: OAuthService, private _iconService: NzIconService) {
    this._iconService.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/font_1506206_4bw6p4chwn8.js'
    });
    // this.authService.configure(authConfig);
    // this.authService.tokenValidationHandler = new JwksValidationHandler();
    // this.authService.loadDiscoveryDocumentAndLogin();
  }
}
