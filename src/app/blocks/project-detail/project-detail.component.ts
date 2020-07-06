import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServersService } from '../../servers.service';
import { environment } from '../../../environments/environment';
import { MapService } from '../../services/map.service'
declare let Swiper: any;
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.less']
})
export class ProjectDetailComponent implements OnInit {
  mySwiper: any;
  public projectInfo: any =  JSON.parse(sessionStorage.getItem('projectInfo'));
  public detailSpinning: boolean;
  public projectId;
  public cardOpen;
  public size;
  // tslint:disable-next-line: variable-name
  public api_projectDetail = '/api/ProjectManager/GetProjectById';
  constructor(private router: ActivatedRoute, public server: ServersService, public mapServer: MapService) { 
  }
  ngOnInit() {
    if (this.server.visibleTide) {
      this.mapServer.createManyGraphics(this.server.tideData);
    }
    // 订阅router改变
    this.router.params.subscribe((params) => {
      this.projectId = params.projectId;
      this.mapServer.mapComplete.subscribe(res => {
        if (res) {
          this.server.view.goTo({
            center: [this.projectInfo.longitude, this.projectInfo.latitude],
            zoom: 13
          }, { duration: 1500 });
        }
      });
    });
  }
  // 获取工程详细信息
  getProjectInfo() {
    this.detailSpinning = true;
    const options = {
      origin: environment.APISmartLocation,
      api: this.api_projectDetail,
      params: {
        id: this.projectId
      }
    }
    let response = this.server.getRxjsData(options);
    response.subscribe((data) => {
      this.projectInfo = data.data;
      this.detailSpinning = false;
      // this.projectInfo.projectImgInfo.forEach(element => {
      //   element.url = 'url(' + environment.APIAutoDeform + element.url + ')';
      // });
      sessionStorage.setItem("projectInfo", JSON.stringify(this.projectInfo));
      this.mapServer.mapComplete.subscribe(res => {
        if (res) {
          this.server.view.goTo({
            center: [this.projectInfo.longitude, this.projectInfo.latitude],
            zoom: 13
          }, { duration: 1500 })
        }
      })
    })
  }
}