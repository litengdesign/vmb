import { Component, OnInit, Output, EventEmitter, Pipe } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ServersService } from '../../servers.service';
import { Observable } from 'rxjs';
import { MapService } from '../../services/map.service'
@Pipe({ name: 'pointerFloor' })
@Component({
  selector: 'app-project-detail-map',
  templateUrl: './project-detail-map.component.html',
  styleUrls: ['./project-detail-map.component.less']
})

export class ProjectDetailMapComponent implements OnInit {
  public view;
  public layer;
  public tdtImgLayerActive = false;
  public zoom = 6;
  public center = {
    longitude: 118.92,
    latitude: 34.648
  };
  public popoverStyle=null;
  public showPop=null;
  public selectedPoint=null;
  public closePop=null;

  constructor(public server: ServersService, public mapServer: MapService) { 
    this.mapServer.visibleAIS=false
  }
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
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
      "esri/widgets/CoordinateConversion",
      "esri/widgets/DistanceMeasurement2D",
      "esri/widgets/AreaMeasurement2D",
      "esri/layers/FeatureLayer",
    ]).then(([Map, MapView, TileLayer, Sketch, TDTLayer, GraphicsLayer, 
      Graphic,
      CoordinateConversion,
      DistanceMeasurement2D,
      AreaMeasurement2D,
      FeatureLayer
      ]) => {
      this.server.map = new Map({
        basemap: {}
      });
      this.server.view = new MapView({
        container: "viewDiv",
        map: this.server.map,
        zoom: this.server.zoom,
        center: [this.center.longitude, this.center.latitude],
      });
      this.server.view.constraints = {
        maxZoom: 18,//最大空间等级
        minZoom: 4,//最小空间等级
      }
      this.server.view.ui.move(["zoom"], "bottom-right");
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


      //添加经纬度显示控件
      var ccWidget = new CoordinateConversion({
        view: this.server.view
      });
      this.server.view.ui.add(ccWidget, "bottom-right");

      //添加测量工具
      this.server.view.ui.add("topbar", "bottom-right");
      var serverView=this.server.view
      var activeWidget = null;
      document.getElementById('distanceButton').addEventListener('click',function(){
        setActiveWidget(null);
        if (!this.classList.contains("active")) {
          setActiveWidget("distance");
        } else {
            setActiveButton(null);
        }
      })
      document.getElementById('areaButton').addEventListener('click',function(){
        setActiveWidget(null);
        if (!this.classList.contains("active")) {
          setActiveWidget("area");
        } else {
            setActiveButton(null);
        }
      })
      function setActiveWidget(type){
        switch (type) {
          case "distance":
              activeWidget = new DistanceMeasurement2D({
                  view: serverView
              });
              activeWidget.viewModel.newMeasurement();
              serverView.ui.add(activeWidget, "bottom-right");
              setActiveButton(document.getElementById("distanceButton"));
              break;
          case "area":
              activeWidget = new AreaMeasurement2D({
                  view: serverView
              });
              activeWidget.viewModel.newMeasurement();
              serverView.ui.add(activeWidget, "bottom-right");
              setActiveButton(document.getElementById("areaButton"));
              break;
          case null:
              if (activeWidget) {
                  serverView.ui.remove(activeWidget);
                  activeWidget.destroy();
                  activeWidget = null;
              }
              break;
        }
      }
      function setActiveButton(selectedButton){
        serverView.focus();
        var elements = document.getElementsByClassName("active");
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
        }
        }
      // var featureLayer = new TileLayer({
      //   url: "http://10.9.52.50:6080/arcgis/services/xgjc/MapServer"
      // });

      this.server.map.addMany([this.server.tdtLayer, this.server.annoTDTLayer]);
      this.server.view.when(() => {
        this.checkedBack.emit();
        this.mapServer.mapComplete.next(true);
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
