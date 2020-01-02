import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { differenceInCalendarDays, differenceInHours, addDays, format } from 'date-fns';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { OAuthService } from 'angular-oauth2-oidc';
import { NzModalService } from 'ng-zorro-antd/modal';
@Injectable({
  providedIn: 'root'
})
export class ServersService {
  public systemName = '智慧工地集成平台2.0';
  public configUrl = environment.API; //获取环境文件中api地址
  //arcgis
  public postHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json', Authorization: "Bearer " + this.oauthService.getAccessToken() }
  )
  public getHeaders = new HttpHeaders(
    { Authorization: "Bearer " + this.oauthService.getAccessToken() }
  )
  // arcgis params
  public map;
  public view;
  public layer;
  public tdtLayer;
  public annoTDTLayer;
  public tdtImgLayer;
  public annoImgTDTLayer;
  public zoom = 13;
  constructor(private http: HttpClient, private msg: NzMessageService, public oauthService: OAuthService, private modalService: NzModalService){

  }
  //通过rxjs获取数据
  getRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.get(options.origin ? options.origin + options.api : this.configUrl + options.api, { params: options.params, headers: this.getHeaders }).subscribe((response: any) => {
        if (response.status !== 0) {
          observer.next(response);
          //记录登录信息
          // this.loginRecord();
        } else {
          return false;
        }
      }, (error) => {
        if (error.status == 403 || error.status == 401) {

          this.oauthService.initImplicitFlow();
        }
      })
    })
  }
  postRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.post(options.origin ? options.origin + options.api : this.configUrl + options.api, JSON.stringify(options.params), { headers: this.postHeaders }).subscribe(
        (response: any) => {
          this.msg.info(response.message);
          if (response.code != -1) {
            observer.next();
          } else {
            return false;
          }
        },
        (error) => {
          if (error.status == 403 || error.status == 401) {
            this.oauthService.initImplicitFlow();
          }
        }
      );
    });

  }
}
