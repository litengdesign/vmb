import { Component, OnInit, Output, EventEmitter, Pipe } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ServersService } from '../../servers.service';
import { Observable } from 'rxjs';
@Pipe({ name: 'pointerFloor' })
@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.less']
})

export class ArcgisMapComponent implements OnInit {
  public view;
  public layer;
  public tdtImgLayerActive = false;
  public zoom = 13;
  public center = {
    longitude: 120.144,
    latitude: 33.363
  };


  constructor(public server: ServersService) { }
  @Output('checked') checkedBack = new EventEmitter<any>();
  ngOnInit() {
    //加载地图
    this.initMap();
  }
  initMap() {
    // first, we use Dojo's loader to require the map class
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/TileLayer",
      "esri/widgets/Sketch",
      "extras/TDTLayer",
    ]).then(([Map, MapView, TileLayer, Sketch, TDTLayer]) => {
      this.server.map = new Map({
        maxZoom: 18,//最大空间等级
        minZoom: 5,//最小空间等级
        basemap: {}
      });
      this.server.view = new MapView({
        container: "viewDiv",
        map: this.server.map,
        zoom: this.server.zoom,
        center: [120.144, 33.363],
      });
      this.server.view.constraints = {
        maxZoom: 18,//最大空间等级
        minZoom: 5,//最小空间等级
      }
      //天地图
      // a36dc2a566d2cb38689a0ed655af5cd7
      // 2e05721705e9a4255bf8f61fea3629c5
      this.server.tdtLayer = new TDTLayer({
        urlTemplate: "http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=c098cedca4b93ed2f825b4062c46aed4",
      });
      //天地图标识
      this.server.annoTDTLayer = new TDTLayer({
        urlTemplate: "http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=c098cedca4b93ed2f825b4062c46aed4",
      })
      //天地图卫星图
      // this.server.tdtImgLayer = new TileLayer({
      //   url: "http://10.9.52.50:6080/arcgis/rest/services/TDT_SatelliteMap/MapServer"
      // });
      this.server.tdtImgLayer = new TDTLayer({
        urlTemplate: "http://t0.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&tk=c098cedca4b93ed2f825b4062c46aed4"
      });

      this.server.annoImgTDTLayer = new TDTLayer({
        id: "anooImgMarkerLayer",
        title: "anooImgMarkerLayer",
        urlTemplate: "http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={col}&y={row}&l={level}&tk=c098cedca4b93ed2f825b4062c46aed4"
      });
      this.server.map.addMany([this.server.tdtLayer, this.server.annoTDTLayer]);
      this.server.view.when(() => {
        this.checkedBack.emit();
        this.server.view.on("pointer-move", ($event) => {
          const point = this.server.view.toMap({
            x: $event.x,
            y: $event.y
          });
          this.server.zoom = this.server.view.zoom;
          this.center = {
            longitude: point.longitude,
            latitude: point.latitude,
          };
        })
      })
    })
      .catch(err => {
        console.error(err);
      });
  }
}
