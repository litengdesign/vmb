import { Component, OnInit, OnChanges, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServersService } from '../../servers.service';
import { ProjectPageService } from './project-page.service';
import { loadModules } from 'esri-loader';
import { environment } from 'src/environments/environment';
import { MapService } from '../../services/map.service'
import { differenceInCalendarDays, differenceInHours, addDays, format} from 'date-fns';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DomSanitizer,SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.less']
})

export class ProjectPageComponent implements OnInit {
  public projectInfo: any = JSON.parse(sessionStorage.getItem("projectInfo"));
  public markerLayer = null;
  iframe:SafeResourceUrl;   //定义变量
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  public shipID=null;
  public isModaliframeVisable = false;
  public projectWeather:any;
  @ViewChild('mainNavigate',{static:false}) public mainNavigateEl;
  @ViewChild('arcgisMap',{static:false}) public arcgisMapEl;
  @ViewChild('mainAvatar',{static:false}) public mainAvatarEl;
  
  constructor(
    public http: HttpClient,
    public server: ServersService,
    public projectPageService: ProjectPageService,
    public mapService: MapService,public router:Router,
    private sanitizer: DomSanitizer) {
     this.projectPageService.showIframeSubject.subscribe(data=>{
       if(data){
        // this.isModaliframeVisable = true;
        // this.iframe=this.sanitizer.bypassSecurityTrustResourceUrl(data)
        window.open(data);
       }
     })
  }

  ngOnInit() {
    if(this.mapService.visibleAIS){
      this.server.map.remove(this.server.map.findLayerById('AIS_ShipLayer'))
      this.mapService.buildAisFeature() 
    }
    this.getProjectGeo();
  }

  getSystemData() {
    //MAP 定位项目中心点
    loadModules([
    ]).then(() => {
      this.projectPageService.subjectMapStatus.next(true);
      if(this.server.visibleTide){
        this.mainAvatarEl.visibleTideChange(true)
      }
      
      this.server.view.goTo({
        center: [this.projectInfo.longitude || '122.52', this.projectInfo.latitude ||'31.86'],
        zoom: 13
      }, { duration: 1500 })
    })
  }
  //退出工程
  exitProject(){
    this.router.navigateByUrl('/dashboard/projectDetail/'+this.projectInfo.id);
  }
  // 更加工程经纬度获取城市code
  getProjectGeo(){
    const apiGeo = `http://restapi.amap.com/v3/geocode/regeo?output=json&location=
    ${this.projectInfo.longitude},${this.projectInfo.latitude}&key=b72e513745b43577ac5814b2ab626190&radius=10000`;
    this.http.get(apiGeo).subscribe((res: any) => {
          // tslint:disable-next-line: radix
          this.getWeather(parseInt(res.regeocode.addressComponent.adcode));
    });
  }
  // 获取项目天气
  getWeather(adcode: number) {
    const apiWeather = 'https://restapi.amap.com/v3/weather/weatherInfo?city=' +
    + adcode + '&key=b72e513745b43577ac5814b2ab626190';
    this.http.get(apiWeather).subscribe((data:any) => {
      if (data.status) {
        this.projectWeather = data.lives[0];
      }
    });
  }

}
