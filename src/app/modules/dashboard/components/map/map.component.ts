import { Component, OnInit, Output, EventEmitter, Pipe } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ComomService } from '../../../../shared/servers.service';
import { Observable } from 'rxjs';
import { MapService } from '../../../../shared/map.service'
import { environment,environmentAutomonitor, environmentProject, environmentVolum } from 'src/environments/environment';
import { markerSyConfig,AisSymConfig } from './symbol'

@Component({  
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})

export class MapComponent implements OnInit {
  public view;
  public layer;
  public tdtImgLayerActive = false;
  public zoom = 10;
  public center = {
    longitude: 118.92,
    latitude: 34.648
  };
  public popoverStyle=null;
  public showPop=null;
  public selectedPoint=null;
  public closePop=null;

  //
  public FeatureLayer=null;
  public AISLayerVisible=false;
  public AISloading = true;
  public AISDataList=null;
  public locationMarker=null;
  public systemList:any[] = [
    {
      name: '自动化变形监测',
      id:'ADS',
      url: '',
      description: '结构体自动化变形/位移监测系统',
      type: '安全监管类',
      icon: 'icon-zidongjiancezhan',
      viewMapVisible:true, //是否在地图显示
      collapsible:false, //是否收起
      searchVisible: false,
      header:'测点列表',
      hasSearch:false,
      origin: environmentAutomonitor.Origin,
      api: '/api/DeviceManage/GetDevivceList', //获取测点列表
      detailAPI:'/api/DeviceManage/GetDevice', //获取特定测点
      data:[],
      list:[],
      graphicList:[],
      options: {
        origin: environmentAutomonitor.Origin,
        api: '/api/DeviceManage/GetDevice'
      },
    }, {
      name: '生产调度系统',
      id: 'PSS',
      url: '',
      description: '大面积精密分区填海项目生产调度系统',
      type: '安全监管类',
      icon: 'icon-shengchantiaodu',
      viewMapVisible:true,
      viewMapAisVisible:false,
      collapsible:false,
      searchVisible: false,
      header: '载具列表',
      shipLayerVisible:true,
      hasSearch: false,
      viewMapDisable:true,
      api:'/api/LocationData/GetCarrierLocationData',
      data: [],
      list: [],
      graphicList:[],
      options: {
        origin: environmentProject.Origin,
        api: '/api/DeviceManage/GetDevice'
      }
    },

  ]
  public visibleTide = false;//地图是否默认加载潮位站
  public visibleTidalList = false;
  public api_tide_list = '/api/TidalStationInfo/GetListTidalStationInfo';
  public isVisibleHdi = false;
  //搜索
  public inputValue: string;
  public options: string[] = [];
  public msgMap;
  public msgView;

  constructor(public server: ComomService, public mapServer: MapService) { }
  @Output('checked') checkedBack = new EventEmitter<any>();
  ngOnInit() {
    //加载地图
    this.initMap();
  }
  initMap() {
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
      "esri/layers/MapImageLayer",
      "dojo/domReady!"
    ]).then(([Map, MapView, TileLayer, Sketch, TDTLayer, GraphicsLayer, 
      Graphic,
      CoordinateConversion,
      DistanceMeasurement2D,
      AreaMeasurement2D,
      FeatureLayer,
      MapImageLayer,
      ]) => {
      this.FeatureLayer=FeatureLayer;
      this.server.map = new Map({
        // basemap: {}
        basemap: "dark-gray"
      });
      this.server.view = new MapView({
        container: "viewDiv",
        map: this.server.map,
        zoom: 5,
        center: [this.center.longitude, this.center.latitude],
      });
      this.msgMap = "this.server.map:"+JSON.stringify(this.server.map.basemap);
      this.msgView = "this.server.view:"+JSON.stringify(this.server.view.basemapView);
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
        visible:false
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
      // this.server.view.ui.add("topbar", "bottom-right");
      // this.server.view.popup.on('trigger-action',(event,a)=>{
      //   if(event.action.id==='edit-guiji'){
      //     this.mapServer.mapPopupAction(event);
      //   }
      // })
      // var serverView=this.server.view
      // var activeWidget = null;
      // document.getElementById('distanceButton').addEventListener('click',function(){
      //   setActiveWidget(null);
      //   if (!this.classList.contains("active")) {
      //     setActiveWidget("distance");
      //   } else {
      //       setActiveButton(null);
      //   }
      // })
      // document.getElementById('areaButton').addEventListener('click',function(){
      //   setActiveWidget(null);
      //   if (!this.classList.contains("active")) {
      //     setActiveWidget("area");
      //   } else {
      //       setActiveButton(null);
      //   }
      // })
      // function setActiveWidget(type){
      //   switch (type) {
      //     case "distance":
      //         activeWidget = new DistanceMeasurement2D({
      //             view: serverView
      //         });
      //         activeWidget.viewModel.newMeasurement();
      //         serverView.ui.add(activeWidget, "bottom-right");
      //         setActiveButton(document.getElementById("distanceButton"));
      //         break;
      //     case "area":
      //         activeWidget = new AreaMeasurement2D({
      //             view: serverView
      //         });
      //         activeWidget.viewModel.newMeasurement();
      //         serverView.ui.add(activeWidget, "bottom-right");
      //         setActiveButton(document.getElementById("areaButton"));
      //         break;
      //     case null:
      //         if (activeWidget) {
      //             serverView.ui.remove(activeWidget);
      //             activeWidget.destroy();
      //             activeWidget = null;
      //         }
      //         break;
      //   }
      // }
      // function setActiveButton(selectedButton){
      //   serverView.focus();
      //   var elements = document.getElementsByClassName("active");
      //   for (var i = 0; i < elements.length; i++) {
      //       elements[i].classList.remove("active");
      //   }
      //   if (selectedButton) {
      //       selectedButton.classList.add("active");
      //   }
      //   }
      // var mapSever = new MapImageLayer({
      //   url:"http://47.102.116.25:9000/arcgis/rest/services/JiangsuPurplishBlueTileMap/MapServer"
      // })



      
      let baseBuleUrl='http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
      var baseBuleLayer=new MapImageLayer({
        url:baseBuleUrl
      })

      this.server.map.addMany([this.server.tdtLayer]);
      this.server.map.add(baseBuleLayer)

      // this.server.map.addMany([mapSever]);
      this.server.view.when(() => {
        this.getProjectData()
        this.getAisShipData()
        this.getTide();
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
      this.server.view.popup.on("trigger-action", (event)=> {
        if(event.action.id==='pipePoint_details'){
          // console.log(event.target.features)
          this.server.selectedProject.next(event.target.features[0].attributes.id);
          // this.getPointDetail(event.target.features[0].attributes.id);
          // if (event.target.features[0].attributes.id =='fc3f255c-cba0-490f-9c2e-a32146387ab9'){
          //   this.getCheckWorkPoint()
          // }
          // //获取智能位置数据
          // this.getPssData()
        }
      });
        })
        .catch(err => {
          console.log(JSON.stringify(err))
        });
  }
  //获取变形监测测点信息
  getAutoDeform(id): void {
    let options = {
      origin: environmentAutomonitor.Origin,
      api:'/api/DeviceManage/GetDevivceList',
      params:{
        ProjectId: id,
        Sidx: '0'
      }
    }
    this.server.getRxjsData(options).subscribe(data=>{

      this.systemList[0].graphicList = [];
      if(data.data.length){
        this.systemList[0].collapsible = true;
      }
      data.data.forEach(item => {
        this.systemList[0].graphicList.push({
          type: "point",
          symbolType: "picture-marker",
          longitude: item.lon,
          latitude: item.lat,
          attributes: {
            name: item.deviceName,
            id: item.deviceId,
            icon:'icon-dibiaoshuishuizhijiancezhan',
            systemId: this.systemList[0].id,
            options:{
              origin: environmentAutomonitor.Origin,
              api: '/api/DeviceManage/GetDevice', 
              params:{
                id: item.deviceId
              }
            }
          },
          systemId: this.systemList[0].id
        })
      });
      this.systemList[0].list = this.systemList[0].graphicList;
      this.mapServer.removeManyGraphics(this.systemList[0].graphicList)
      this.mapServer.createManyGraphics(this.systemList[0]).subscribe(res => {
        this.systemList[0].graphics = res.graphics;
      })
    })
  }
  getProjectData(){
    let options={
      api:'/api/ProjectManage/GetPorjectList',
      origin:environmentVolum.Origin,
      params:{
        Sidx:0,
        Rows:9999
      }
    }
    this.server.getRxjsData(options).subscribe((data: any) => {
      this.createFeature(data.pageResult.data)
    })
  }
  createFeature(data){
    let features=[]
    for (let item of data) {
      if(item.latitude && item.longitude){
        features.push({
            geometry: {
                type: 'point',
                x: item.longitude,
                y: item.latitude
            },
            attributes: {
                OJBEDTID: item.id,
                lon: item.longitude,
                lat: item.latitude,
                name: item.name,
                companyName: item.companyName,
                customerName: item.customerName,
                typeName: item.typeName,
                code: item.code,
                id: item.id,
                projectId: item.projectId
            }
        })
      }
    }
    if(features){
      this.createMarkerFeatureLayer(features)
    }
  }

  createMarkerFeatureLayer(features){
    // console.log(features)
    const pointLayer = new this.FeatureLayer({
      id: 'projectPointLayer',
      spatialReference: {
          wkid: 4326
      },
      objectIdField: "OBJECTID",
      geometryType: "point",
      fields: markerSyConfig.PipePointFeatureLayer_Fields,
      // labelingInfo: [SymbolConfig.LabelClass_HDLL],
      popupTemplate: markerSyConfig.PopupTemplate_HDLL,
      renderer: markerSyConfig.RENDERER_HDLL,
      source: features,
      title: '项目'
    })
    this.server.map.add(pointLayer)
  }

  AisLayerVisibleChange(event){
    this.server.map.findLayerById('AIS_Layer').visible=this.AISLayerVisible
  }

  getAisShipData(){
    let options = {
      origin:'http://10.9.53.103:5300',
      api: '/api/LocationData/GetCarrierLocationData',
      params: {
        Sidx: 0,
        Rows: 100
      }
    }
    this.server.getRxjsData(options).subscribe((data:any)=>{
      // console.log(data)
     this.AISDataList=data.data.aisLocationData;
     this.AISloading=false;
     this.buildAisFeature();
    })
  }

  buildAisFeature(){
    let features = [];
    for (let item of this.AISDataList) {
      features.push({
        geometry: {
          type: 'point',
          x: item.lon,
          y: item.lat
        },
        attributes: {
          OJBEDTID: item.shipName,
          type: 'ship',
          lon: item.lon,
          lat: item.lat,
          angle: item.hdg,
          name: item.shipName,
          lastestTime: item.lastestTime,
          mmsi: item.mmsi,
          navigationStatus: item.navigationStatus,
          rot: item.rot,
          sog: item.sog
        }
      })
    }
    this.createShipLayer(features)
  }
  
    createShipLayer(features) {
        loadModules([
          "esri/renderers/SimpleRenderer",
        ]).then(([
          SimpleRenderer
        ]) => {
          const RENDERER_CIRCLE = new SimpleRenderer({
            symbol: {
              type: "simple-marker",
              color: "yellow",
              outline: {
                color: [255, 255, 255, 0.7],
                width: 0.5
              },
              size: 10
            }
          });
          let AisImgUrl='../../assets/mapIMG/aisShip.svg';
          const RENDERER_SHIP = {
            type: "unique-value",
            field: 'angle',
            defaultSymbol: {
              type: "picture-marker",
              url: AisImgUrl,
              width: 10,
              height: 20,
              angle: 0
            },
            uniqueValueInfos: []
          }
          let tempAngleSymbol = []
          for (let i = 0; i < 360; i++) {
            tempAngleSymbol.push({
              value: i,
              symbol: {
                type: "picture-marker",
                url: AisImgUrl,
                width: 10,
                height: 20,
                angle: i
              }
            })
          }
          RENDERER_SHIP.uniqueValueInfos = tempAngleSymbol
          this.createFeatureLayer('AIS_Layer', AisSymConfig.shipLayerField,AisSymConfig.popupTemplate, AisSymConfig.label, RENDERER_CIRCLE, RENDERER_SHIP, features)
        })
  }

  createFeatureLayer(LayerID,LayerField,popupTemplate,labelClass,RENDERER_CIRCLE,RENDERER_SHIP,features){
    loadModules([
      'esri/layers/FeatureLayer',
      "esri/renderers/smartMapping/creators/location",
      "esri/core/watchUtils"
    ]).then(([
      FeatureLayer,
      locationRendererCreator,
      watchUtils
    ])=>{
        var featureLayer=new FeatureLayer({ 
        id:LayerID,
        spatialReference: {
          wkid: 4326
        },
        objectIdField: "OJBEDTID",
        geometryType: "point",
        fields: LayerField,
        labelingInfo: [labelClass],
        popupTemplate:popupTemplate,
        source:features,
        visible:false
      })
      this.server.map.add(featureLayer)
      
      watchUtils.whenTrue(this.server.view,'stationary',()=>{
        if(this.server.view.zoom){
          if(this.server.view.zoom<13){
            featureLayer.renderer=RENDERER_CIRCLE
            locationRendererCreator
              .createRenderer({
                layer: featureLayer,
                view: this.server.view,
                sizeOptimizationEnabled: true
              })
              .then((rendererResponse) => {
                const renderer = rendererResponse.renderer;
                let color=null;
                if(LayerID=='BD_ShipLayer'){
                  color='green'
                }else if(LayerID=='AIS_Layer'){
                  color='yellow'
                }else if(LayerID=='Vehicle_Layer'){
                  color='red'
                }else if(LayerID=='Work_Layer'){
                  color='red'
                }
                renderer.symbol.color = color;
                featureLayer.renderer = renderer;
              })
              .catch((error) => {
                console.error(error);
              });
          }else{
            featureLayer.renderer=RENDERER_SHIP
          }
        }
      })
    })
  }

  toggleZoom(){
    this.server.isOpen = !this.server.isOpen;
  }
  serachPoint(){
    // console.log(this.inputValue)
    let query={
      // objectIds:this.inputValue,
      outFields: ["*"],
      returnGeometry: true,
      where:` id = '${this.inputValue}' `
    }
    this.server.view.whenLayerView(this.server.map.findLayerById('projectPointLayer')).then((featureLayerView) =>{
      featureLayerView.queryFeatures(query).then((result)=> {
        // console.log(result)
        this.addGraphics(result)
      }).catch((e)=>{
        // console.log(e)
      })
    });
  }
  addGraphics(result) {
    result.features.forEach((feature)=> {
        this.server.view.popup.open({
          features: [feature],
          location: [feature.attributes.lon,feature.attributes.lat],
          highlightEnabled:true
        }) 
        this.server.view.goTo({
          center: [feature.attributes.lon, feature.attributes.lat],
          zoom: 12
        }, { duration: 1500 })
    });

  }

  onInput(value: string): void {
    this.options=[]
    let options = {
      origin: environmentVolum.Origin,
      api: '/api/ProjectManage/GetPorjectList',
      params: {
        Sidx: '0',
        Name: value,
        Page:1,
        Rows: 10,
      }
    }
    this.server.getRxjsData(options).subscribe((res: any) => {
      this.options = res.pageResult.data;
    });
  }
  compareFun = (o1, o2) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.label : o1.value === o2.value;
    } else {
      return false;
    }
  };
    //获取点详情
  getPointDetail(item,system) {
    item.moveing = true;
    item.options ={
      origin: system.origin,
      api: system.detailAPI,
      params: {
        id: item.attributes.id
      }
    }
    //列表高亮
    system.list.forEach(element => {
      element.active = false;
      if (element.attributes.id == item.attributes.id) {
        element.active = true;
      }
    })
    this.mapServer.gotoPoint(item).subscribe(res => {
      this.mapServer.createHightGraphics(item).subscribe(res => { })
    })
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
}
