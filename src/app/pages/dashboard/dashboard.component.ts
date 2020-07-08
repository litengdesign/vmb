import { Component, OnInit, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import { environment, environmentVolum } from 'src/environments/environment';
import {  ServersService  } from '../../servers.service';
import { MapService } from '../../services/map.service';
import { Router } from '@angular/router';

// const sizeSymbol={'小型':20,'中型':25,'大型':35,'特大型':40}
const sizeSymbol = { 小型: 25, 中型: 25, 大型: 25, 特大型: 25 };
const colorSymbol = {完工: '#52c41a', 在建: '#3057EF', 暂停: '#d9d9d9', 招标: 'faad14'};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})

export class DashboardComponent implements OnInit {
  public api_project: '/api/v2/Project/GetProject';
  public highLightCirle = null;
  public highLightIMG = null;
  public activeMK = null;
  @ViewChild('mainAvatar', {static: false}) public mainAvatarEl;
  constructor(public server: ServersService, public mapService: MapService, public router: Router) {}
  ngOnInit() {}
  getIMGSymbol(size) {
    return {
      type: 'picture-marker',
      url: 'assets/images/aqm.png',
      width: sizeSymbol[size] - 10,
      height: sizeSymbol[size] - 10,
      angle: 360
    };
  }
  getCircleSymbol(size, color) {
    return {
      type: 'simple-marker',
      color: colorSymbol[color],
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
      size: sizeSymbol[size]
    };
  }
  addProjectPoint(res) {
    loadModules([
      'esri/layers/FeatureLayer',
    ]).then(([FeatureLayer]) => {
      if (this.server.visibleTide) {
        this.mainAvatarEl.visibleTideChange(true);
      }
      for (const item of res.pageResult.data) {
        if (item.longitude && item.latitude) {
          item.code = item.code ? item.code : 'P282';
          item.gradeName = item.gradeName ? item.gradeName : '特大型';
          item.statusName = item.statusName ? item.statusName : '在建';
          const imgFeature = {
              geometry: {
                type: 'point',
                x: item.longitude,
                y: item.latitude
              },
              attributes: {
                OBJECTID: item.code,
                NAME: item.name,
                SIZE: item.gradeName || '特大型',
                COLOR: item.statusName || '在建',
                obj: item
              },
              symbol: this.getCircleSymbol(item.gradeName, item.statusName),
            };
          this.server.view.graphics.add(imgFeature);
          let circleFeature = {
              geometry: {
                type: 'point',
                x: item.longitude,
                y: item.latitude
              },
              attributes: {
                OBJECTID: item.code + 'c',
                NAME: item.name,
                SIZE: item.gradeName,
                COLOR: item.statusName,
                id: item.id,
                obj: item
              },
              symbol: this.getIMGSymbol(item.gradeName),
              MKDATA: item
            };
          this.server.view.graphics.add(circleFeature);
          }
      }
      this.server.view.on('click', (event) => {
        this.server.view.hitTest(event).then((response) => {
          sessionStorage.setItem('projectInfo', JSON.stringify(response.results[0].graphic.attributes.obj));
          // this.activeMK=response.results[0].graphic.MKDATA
          console.log(response.results[0].graphic.MKDATA);
          if (response.results[0].graphic.MKDATA) {
            this.highlightFeature(response.results[0].graphic.MKDATA);
            this.mapService.navigateOpen.next(true);
            this.router.navigate(['/integration/dashboard/projectDetail/' + response.results[0].graphic.attributes.id]);
          } else {
            return;
          }

        });
      });
    });
  }
  highlightFeature(item) {
    if (this.highLightCirle) {
      let l = this.server.view.graphics.items.length;
      this.server.view.graphics.remove(this.server.view.graphics.items[l - 1]);
      this.server.view.graphics.remove(this.server.view.graphics.items[l - 2]);
    }
    this.highLightCirle = {
      geometry: {
        type: 'point',
        x: item.longitude,
        y: item.latitude
      },
      attributes: {
        OBJECTID: 'temp',
        NAME: item.projectName,
        SIZE: item.gradeName,
        COLOR: item.statusName
      },
      symbol: {
        type: 'simple-marker',
        color: '#00BFFF',
        outline: {
          color: '#E1FFFF',
          width: 5,
        },
        size: sizeSymbol[item.gradeName]
      }
    };
    this.highLightIMG = {
      geometry: {
        type: 'point',
        x: item.longitude,
        y: item.latitude
      },
      attributes: {
        OBJECTID: 'temp1',
        NAME: item.projectName,
        SIZE: item.gradeName,
        COLOR: item.statusName
      },
      symbol: {
        type: 'picture-marker',
        url: 'assets/images/aqm.png',
        width: sizeSymbol[item.gradeName] - 10,
        height: sizeSymbol[item.gradeName] - 10,
        angle: 360
      }
    };
    this.server.view.graphics.add(this.highLightCirle);
    this.server.view.graphics.add(this.highLightIMG);
  }
  getProjectData() {
    const options = {
      origin: environmentVolum.Origin,
      api: '/api/ProjectManage/GetPorjectList',
      params: {
        Name: '珠海',
        Sidx: 0,
        Rows: 30
      }
    };
    this.server.getRxjsData(options).subscribe((data: any) => {
      this.addProjectPoint(data);
    });
  }
}
