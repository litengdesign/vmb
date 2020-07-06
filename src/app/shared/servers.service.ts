import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ComomService {
  //api
  public api_token = '/api/login/login';
  public allPointList=[]
  public userToken=''  //泵站接口
  public isOpen=true; //dashboard card默认开关
  public tabIndex = 0;
  //弹框控制
  public visibleDetail: boolean = false; //详情框显示控制
  //全局tab
  public tabs = [];
  public configUrl = environment.Origin; //获取环境文件中api地址
  public postHeaders = new HttpHeaders(
    { 'Content-Type': 'application/json', Authorization: "Bearer "  }
  )
  public getHeaders = new HttpHeaders(
    { Authorization: "Bearer "  }
  )
  //文件上传header
  public headers = new HttpHeaders(
    // { 'Content-Type': 'multipart/form-data',Authorization: "Bearer "  }
    {
      "Authorization": "Bearer " 
    }
  );

  public setMediaUploadHeaders = (file: UploadFile) => {
    return {
      "Authorization": "Bearer " 
    }
  };
  public premissions: any = {}; //权限
  // arcgis params
  public map;
  public view;
  public layer;
  public tdtLayer;
  public annoTDTLayer;
  public tdtImgLayer;
  public annoImgTDTLayer;
  public zoom = 6;
  //other
  public projectId:string;
  public selectedProjectId;
  selectedProject: Subject<any> = new Subject<any>();
  public visibleTide = false;
  public tideData:any = {
    systemId:"Tidal",
    options:{
      origin: environment.APITidal,
      api:'/api/TidalStationInfo/GetTidalStationInfo'
    },
    graphicList:[]
  };
  constructor(public activeRoute:ActivatedRoute,private http: HttpClient, private msg: NzMessageService,public router: Router,private modalService: NzModalService) {
    this.tabs = sessionStorage.getItem('tabs')?JSON.parse(sessionStorage.getItem('tabs')):[];
  }
  //通过rxjs获取数据
  getRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.get(options.origin ? options.origin + options.api : this.configUrl + options.api, { params: options.params, headers: options.header ?options.header:this.getHeaders }).subscribe((response: any) => {
        if (response.status !== 0) {
          observer.next(response);
        } else {
          return false;
        }
      }, (error) => {
        if (error.status == 403 || error.status == 401) {
        }
      })
    })
  }
  postRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.post(options.origin ? options.origin + options.api : this.configUrl + options.api, JSON.stringify(options.params), { headers: this.postHeaders }).subscribe(
        (response: any) => {
          if (response.message){
            this.msg.info(response.message);
          }
          if (response.code != -1 || response.resultFlag =='success') {
            observer.next(response);
          } else {
            return false;
          }
        },
        (error) => {
          if (error.status == 403 || error.status == 401) {
          }
        }
      );
    });

  }
  //关闭弹框显示确认框
  showConfirm() {
    return new Observable<any>((observer) => {
      this.modalService.confirm({
        nzTitle: '确定取消编辑吗？',
        nzOnOk: () => {
          observer.next(false);
        },
        nzOnCancel: () => {
          observer.next(true);
        }
      });
    })
  }
  //控制详情框
  closeDetail() {
    this.visibleDetail = false;
  }
  //fork 请求数据
  /* options 参数
  *  origin：服务ip地址
  *  api：对应api
  *  params:请求参数
  *  headers：特点头部
  * */
  forkRxjsData(options) {
    return this.http.get(options.origin ? options.origin + options.api : this.configUrl + options.api, { params: options.params, headers: this.getHeaders });
  }
  //跳转router
  newRouter(tab) {
    this.tabs.map(item=>{
      item.active = false;
    })
    tab.active = true;
    // that.router.navigate(['/devices/' + that.projectId + '/deviceList/'], { queryParams: { markersList: this.markersList.join("&") } });
    this.router.navigate([tab.url]);
    //将tab存储到sessionStorage
    var result = this.tabs.some( (item)=> {
      return item.menuId == tab.menuId
    })
    if(!result){
      this.tabs.push(tab);
    }
    sessionStorage.setItem('tabs', JSON.stringify(this.tabs))
  }

}
