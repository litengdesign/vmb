import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment, environmentVolum } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { OAuthService } from 'angular-oauth2-oidc';
import { NzModalService } from 'ng-zorro-antd/modal';
@Injectable({
  providedIn: 'root'
})
export class ServersService {
  public systemName = '方量信息化管理平台';
  public apiListShip = '/api/Common/GetShipList'; // 获取所有船舶
  public apiListProject = '/api/ProjectManage/GetPorjectList'; // 获取项目列表
  public configUrl = environment.API; // 获取环境文件中api地址
  public isOpen = true; // dashboard card默认开关
  // arcgis
  public postHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.oauthService.getAccessToken() }
  );
  public getHeaders = new HttpHeaders(
    { Authorization: 'Bearer ' + this.oauthService.getAccessToken() }
  );
  // arcgis params
  public map;
  public view;
  public layer;
  public tdtLayer;
  public annoTDTLayer;
  public tdtImgLayer;
  public annoImgTDTLayer;
  public zoom = 6;
  // other
  public projectId: string;
  public visibleTide = false;
  public tideData: any = {
    systemId: 'Tidal',
    options: {
      origin: environment.APITidal,
      api: '/api/TidalStationInfo/GetTidalStationInfo'
    },
    graphicList: []
  };
  public keyword; // 项目列表搜索关键词
  constructor(
    private http: HttpClient, private msg: NzMessageService, public oauthService: OAuthService, private modalService: NzModalService){}
  // 通过rxjs获取数据
  getRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.get(
        options.origin ? options.origin + options.api : this.configUrl + options.api,
        { params: options.params, headers: this.getHeaders }).subscribe((response: any) => {
        if (response.status !== 0) {
          observer.next(response);
        } else {
          return false;
        }
      }, (error) => {
        if (error.status === 403 || error.status === 401) {
          this.oauthService.initImplicitFlow();
        }
      });
    });
  }
  postRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.post(
        options.origin ? options.origin + options.api : this.configUrl + options.api,
        JSON.stringify(options.params), { headers: this.postHeaders }).subscribe(
        (response: any) => {
          this.msg.info(response.message);
          if (response.code !== -1) {
            observer.next();
          } else {
            return false;
          }
        },
        (error) => {
          if (error.status === 403 || error.status === 401) {
            this.oauthService.initImplicitFlow();
          } else {
            this.msg.info(error.error.text);
            observer.next();
          }
        }
      );
    });

  }
  forkRxjsData(options) {
    return this.http.get(
      options.origin ? options.origin + options.api : this.configUrl + options.api, { params: options.params, headers: this.getHeaders });
  }
  // 获取船舶列表
  getShips(ProjectId) {
    const options = {
      origin: environmentVolum.Origin,
      api: this.apiListShip,
      params: {
        ProjectId,
        Sidx: '0',
      }
    };
    return this.http.get(options.origin + options.api, { params: options.params, headers: this.getHeaders });
  }
  // 获取工程列表
  getProjects() {
    const options = {
      origin: environmentVolum.Origin,
      api: this.apiListProject,
      params: {
        Sidx: '0',
        Rows: '10000'
      }
    };
    return this.http.get(options.origin + options.api, { params: options.params, headers: this.getHeaders });
  }
  getGeo(){
    this.http.get('http://restapi.amap.com/v3/geocode/regeo?output=json&location=113.577,22.289&key=b72e513745b43577ac5814b2ab626190&radius=10000').subscribe(res=>{
      console.log(res);
    })
  };
}
