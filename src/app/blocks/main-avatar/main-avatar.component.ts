import { Component, OnInit } from '@angular/core';
import { ServersService } from '../../servers.service';
import { MapService } from '../../services/map.service';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-main-avatar',
  templateUrl: './main-avatar.component.html',
  styleUrls: ['./main-avatar.component.less']
})
export class MainAvatarComponent implements OnInit {
  public api_userInfo = '/api/Common/GetLoginUserInfo';//获取用户信息
  public userName = 'Admin';
  public alertCount = 0;
  public alertVisible = false;
  public visibleTide = false; // 地图是否默认加载潮位站
  public visibleTidalList = false;
  public api_tide_list = '/api/TidalStationInfo/GetListTidalStationInfo';

  // popup params
  public popoverStyle = {};
  public activePoint = {};
  public showPop = false;
  public selectedPoint: object;
  constructor(public server: ServersService, public msg: NzMessageService, public mapServer: MapService ,
    private oauthService: OAuthService, public modal: NzModalService) { 
    this.mapServer.showPop.subscribe(res=>{
      this.showPop = res
    })
    this.mapServer.selectedPoint.subscribe(res => {
      this.selectedPoint = res
    })
    this.mapServer.tidalOpen.subscribe(res=>{
      this.visibleTideChange(res)
    })
  }

  ngOnInit() {
    // this.getUserName();
    this.getTide();
  }
  public getUserName() {
    const option = {
      origin: environment.APITest,
      api: this.api_userInfo,
    }
    let rxjsData = this.server.getRxjsData(option);
    rxjsData.subscribe((data) => {
      this.userName = data.loginUserInfo.userName;
    })
  }
  logout(): void {
    this.modal.confirm({
      nzTitle: '系统提示！',
      nzContent: '<b>确定登出吗？</b>',
      nzOnOk: () => {
         this.oauthService.logOut();
      }
    });
    // let options: any = {
    //   origin: environment.APITest,
    //   api: "/Home/CasLogout"
    // }
    // this.server.getRxjsData(options).subscribe((data) => {
    //   if (data != null) {
    //     window.location.href = data.data;
    //   }
    // })
  }
  //显示弹框
  showAlert(){
    this.alertVisible = true;
  }
  closeAlert(){
    this.alertVisible = false;
  }
  getTide(status?){
    this.visibleTidalList = status?true:false;
    if (!this.server.tideData.graphicList.length){
      let options = {
        origin: environment.APITidal,
        api: this.api_tide_list,
        params: {
          Sidx: '0'
        }
      }
      this.server.getRxjsData(options).subscribe(data => {
        data.data.forEach((item: any) => {
          this.server.tideData.graphicList.push({
            type: "point", 
            symbolType: "picture-marker",
            longitude: item.lon,
            latitude: item.lat,
            attributes: {
              name: item.stationName,
              id:item.id,
              systemId: this.server.tideData.systemId,
              options: {
                origin: environment.APITidal,
                api: '/api/TidalStationInfo/GetTidalStationInfo',
                params:{
                  id: item.id
                }
              }
            },
            systemId: this.server.tideData.systemId
          })
        })
      })
    }
    
  }
  //获取点详情
  getPointDetail(item){
    this.visibleTidalList  =false;
    item.moveing = true;
    this.server.tideData.options.params={
      id: item.attributes.id
    }
    item.options = this.server.tideData.options;
    this.mapServer.gotoPoint(item).subscribe(res=>{
      this.mapServer.createHightGraphics(item).subscribe(res => {
        this.mapServer.dealStyle();
      })
    })

  }
  //潮位站开关
  visibleTideChange(event){
    if (event){
      this.mapServer.createManyGraphics(this.server.tideData).subscribe(res => {
        // this.msg.info(res.message)
        this.server.tideData.graphics = res.graphics;
      })
    }else{
      this.mapServer.removeManyGraphics(this.server.tideData.graphics);
    }

  }

  //AIS开关
  visibleAISChange(event){
    if(event){
      if(!this.mapServer.AisDataState){
        setTimeout(() => {
          this.mapServer.visibleAIS=event; 
          this.mapServer.buildAisFeature()    
        }, 2000);
      }else{
        this.mapServer.visibleAIS=event; 
        this.mapServer.buildAisFeature()    
      }
    }else{
      this.mapServer.visibleAIS=event; 
      this.server.map.remove(this.server.map.findLayerById('AIS_ShipLayer'))
    }
  }

  //处理弹框位置
  dealStyle() {
    let screenPoint = this.server.view.toScreen(this.activePoint)
    this.popoverStyle = {
      left: (screenPoint.x + 30) + 'px',
      top: (screenPoint.y - 195) + 'px',
    }
  }
  closePop(){
    this.showPop = false;
    this.mapServer.showPop.next(false);
  }

}
