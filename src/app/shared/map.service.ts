import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ComomService } from './servers.service';
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';
import { differenceInCalendarDays, differenceInHours, addDays, format} from 'date-fns';
import { environmentProject } from '../../environments/environment';
interface Geometry {
  type: string,
  longitude?: number, //点
  latitude?: number, //点
  paths?: [], // 线段polyline
  rings?: [], //多边形polygon
}
interface Symbol {
  type: string, // autocasts as new SimpleMarkerSymbol()
  color?: [],
  outline?: {},
  width?: string
}
interface Graphic {
  type: string,
  symbolType?: string,
  longitude?: string,
  latitude?: string,
  paths?: [],
  attributes?: any,
  color?: [],
  outline?: {},
  width?: string,
  systemId: string,
  options: {
    api: string,
    origin: string,
    params: {}
  }
  popupTemplate: {}

}
@Injectable({
  providedIn: 'root'
})
export class MapService {
  //轨迹路径
  public playerHtmlDisplay=false;
  public playState=true;
  public playSHIP=null;
  public guiji_isVisible=false;
  public SHIPMMsi=''
  public playLayerId=''
  //延时播放
  public suspendState = true;
  public suspendTime = 200;
  public suspendStep = null;
  public setTime=null;
  public arr=[];

  public AisDataState=false;
  public visibleAIS=false;
  // public dateRange= [format(addDays(new Date(), -1), 'yyyy-MM-dd'),
  // format(new Date(), 'yyyy-MM-dd')]; //船舶历史时间默认值
  public dateRange= [format(addDays(new Date(), -1), 'yyyy-MM-dd'),
  format(new Date(), 'yyyy-MM-dd')]; //船舶历史时间默认值
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  public shipID=null;

  public AISDataList=[];

  public highLightCirle;
  public activePoint = {};
  public popVisible = false;
  public bdShipLayer=null;
  showPop: Subject<boolean> = new Subject<boolean>();
  selectedPoint: Subject<any> = new Subject<any>();
  popoverStyle: Subject<any> = new Subject<any>();
  mapComplete: Subject<boolean> = new Subject<boolean>();
  navigateOpen: Subject<boolean> = new Subject<boolean>();
  tidalOpen: Subject<boolean> = new Subject<boolean>();
  constructor(public server: ComomService) {
    this.getAisShipList()
    this.showPop.subscribe(res => {
      if (!res) {
        this.server.view.graphics.remove(this.highLightCirle);
      }
    })
    this.mapComplete.subscribe(res => {
      if (res) {
        this.onMapComplete();
      }
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
        source:features
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
                }else if(LayerID=='AIS_ShipLayer'){
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

  mapPopupAction(event){
    this.playLayerId=event.target.features[0].layer.id;
    if(this.playLayerId=="AIS_ShipLayer"){
         this.shipID=event.target.features[0].attributes.mmsi 
    }
    if(this.playLayerId=="BD_ShipLayer"){
      this.shipID=event.target.features[0].attributes.cardNumber 
    }
    this.SHIPMMsi=`载具：${this.shipID}`
    this.showModal()
  }
  
  //轨迹modal
  showModal(): void {
    this.guiji_isVisible = true;
  }
  handleCancel():void{
    this.guiji_isVisible = false
  }
  handleOk(): void {
    this.arr=[];
    this.server.map.remove(this.server.map.findLayerById('trajectoryPoint'));
    this.server.map.remove(this.server.map.findLayerById('trajectoryLine'));
    this.server.view.graphics.remove(this.playSHIP)
    this.guiji_isVisible = false;
    this.getAisShipTrajectoryData(this.shipID,this.dateRange)
  }

  getAisShipTrajectoryData(id,date){
    document.getElementById('viewDiv').style.cursor='wait'
    let options=null;
    if(this.playLayerId=="AIS_ShipLayer"){
       options = {
        api: '/api/LocationData/AisHistoryTraces',
        // origin:environment.APIAutoDeform,
        params: {
          Mmsi:this.shipID,
          StartTime: format(new Date(this.dateRange[0]), 'yyyy-MM-dd'),
          EndTime: format(new Date(this.dateRange[1]), 'yyyy-MM-dd')
        }
      }
    }
    if(this.playLayerId=="BD_ShipLayer"){
      options = {
        api: '/api/LocationData/BdHistoryTraces',
        params: {
          CardNumber :this.shipID,
          StartTime: format(new Date(this.dateRange[0]), 'yyyy-MM-dd'),
          EndTime: format(new Date(this.dateRange[1]), 'yyyy-MM-dd')
        }
      }
    }
    this.server.getRxjsData(options).subscribe((data: any) => {
      document.getElementById('viewDiv').style.cursor='default'
      for(let i=0;i<data.data.length;i++){
        let item=data.data[i]
        item.markerType=(item.course).toString()
        if(this.playLayerId=="AIS_ShipLayer"){
          item.markerType=(item.course).toString()
        }
        if(this.playLayerId=="BD_ShipLayer"){
          item.markerType=(item.course).toString()
        }
        this.arr.push(item)
      }
      loadModules([
        "esri/Graphic",
      ]).then(([
        Graphic
      ]) => {
      this.playSHIP = new Graphic({
        geometry: {
            type: "point",
            longitude: this.arr[0].lon,
            latitude: this.arr[0].lat
        },
        symbol: {
            type: "picture-marker",
            url: '../vmb/assets/images/guiji.png',
            width: 25,
            height: 30,
            angle: 1
        }
      })
    })
      this.arr[0].markerType='startMarker'
      this.arr[this.arr.length-1].markerType='endMarker'
      this.createShipTrajectoryLayer(this.arr)
      this.playerHtmlDisplay=true;
    })
  }
  
  //关闭播放器
  closePlayerHtml(){
    window.clearTimeout(this.setTime)
    this.playerHtmlDisplay=false;
    this.playSHIP.geometry = {
      type: "point",
      longitude:NaN,
      latitude: NaN,
    } 
    this.server.map.remove(this.server.map.findLayerById('trajectoryLine'))
    this.server.map.remove(this.server.map.findLayerById('trajectoryPoint'))
  }
  //开始播放
  playShipTrajectory(){
    this.playState=!this.playState
    if (this.suspendStep == null) {
        this.server.view.graphics.remove(this.playSHIP)
        this.server.view.graphics.add(this.playSHIP)
        this.delayEachArray(this.suspendTime, this.arr, undefined);
        this.suspendStep = 0
    } else {
      this.server.view.graphics.remove(this.playSHIP)
      this.server.view.graphics.add(this.playSHIP)
        this.suspendState = !this.suspendState;
        if (this.suspendState) {
            this.delayEachArray(this.suspendTime,this.arr, this.suspendStep);
        }
    }
  }
  moveShip(index){
    this.playSHIP.geometry = {
      type: "point",
      longitude: this.arr[index].lon,
      latitude: this.arr[index].lat,
      angle: this.arr[index].heading
    } 
    this.server.view.goTo(this.playSHIP, {
      duration: 500
    });
  }
  //结束播放
  playOver(){
      this.playState=true;
      this.suspendStep = null;
  }
  delayEachArray(delay, arr, index) {
    if (index == undefined) {
      index = 0
    }
    if (this.suspendState) {
        this.moveShip(index)
        index++;
        if (index < arr.length) {
          this.setTime= setTimeout(() => {
              this.delayEachArray(delay, arr, index);
            }, delay)
        } else {
          this.playOver()
        }
    } else {
        this.suspendStep = index
        return
    }
  }
  returnSelectDate(){
    this.showModal()
  }

  createShipTrajectoryLayer(arr){
    this.server.map.remove(this.server.map.findLayerById('trajectoryPoint'));
    this.server.map.remove(this.server.map.findLayerById('trajectoryLine'));
    if(arr==undefined){
      this.server.map.remove(this.server.map.findLayerById('trajectoryPoint'));
      this.server.map.remove(this.server.map.findLayerById('trajectoryLine'));
      return
    }
    loadModules([
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
    ]).then(([
      FeatureLayer,
      GraphicsLayer,
      Graphic
    ])=>{
      let features = []
      let paths = []
      let tempAngleSymbol = []
      const RENDERER = {
        type: "unique-value",
        field: 'markerType',
        defaultSymbol: {
          // type: "picture-marker",
          // url: '../vmb/assets/images/fx.png',
          // width: 15,
          // height: 15,
          // angle: 1
          type: "simple-marker",
          // color: [0, 191, 255],
          color:'red',
          outline: {
            color: [255, 255, 255, 0.7],
            width: 0.5
          },
          size: 6
        },
        uniqueValueInfos: [{
            value: 'startMarker',
            symbol: {
                type: "picture-marker",
                url: '../vmb/assets/images/start.png',
                width: 25,
                height: 25
            }
        }, {
            value: 'endMarker',
            symbol: {
                type: "picture-marker",
                url: '../vmb/assets/images/end.png',
                width: 25,
                height: 25
            }
        }]
      };
      // for (let i = 0; i < 360; i++) {
      //     tempAngleSymbol.push({
      //         value: i,
      //         symbol: {
      //             type: "picture-marker",
      //             url: '../vmb/assets/images/fx.png',
      //             width: 15,
      //             height: 15,
      //             angle: i
      //         }
      //     })
      // }
      // RENDERER.uniqueValueInfos = RENDERER.uniqueValueInfos.concat(tempAngleSymbol)
      const popupTemplate_j = {
        title: "轨迹坐标点信息",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "date",
                label: "日期",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            }, {
                fieldName: "lng",
                label: "经度",
                format: {
                    places: 5,
                    digitSeparator: true
                }
            }, {
                fieldName: "lat",
                label: "纬度",
                format: {
                    places: 5,
                    digitSeparator: true
                }
            }, ]
          }]
        };
        const JCDlayerField = [{
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
          }, {
              name: "name",
              alias: "name",
              type: "string"
          }, {
              name: "markerType",
              alias: "markerType",
              type: "string"
          }, {
            name: "date",
            alias: "date",
            type: "string"
        }, {
              name: "lng",
              alias: "lng",
              type: "double"
          }, {
              name: "lat",
              alias: "lat",
              type: "double"
          }];
          for (let i = 0; i < arr.length; i++) {
            paths.push([arr[i].lon, arr[i].lat])
            features.push({
                geometry: {
                    type: 'point',
                    x: arr[i].lon,
                    y: arr[i].lat
                },
                attributes: {
                    ObjectID: i,
                    markerType: arr[i].markerType,
                    name: 'xxxx',
                    lng: arr[i].lon,
                    lat: arr[i].lat,
                    date:arr[i].dataTime
                }
            })
        }
        var polylineGraphic = new Graphic({
            geometry: {
              type: "polyline",
              paths: paths
            },
            symbol: {
              type: "simple-line",
              // color: [0, 191, 255],
              color:'red',
              style: "dash-dot",
              width: 2
            }
        });

        var lineLayer = new GraphicsLayer({
            id: 'trajectoryLine',
            graphics: [polylineGraphic]
        });
        var markerLayer= new FeatureLayer({
          id: 'trajectoryPoint',
          source: features,
          spatialReference: {
              wkid: 4326
          },
          fields: JCDlayerField,
          objectIdField: "ObjectID",
          geometryType: "point",
          popupTemplate: popupTemplate_j,
          renderer: RENDERER,
          outFields: ["*"],
        })
        this.server.map.add(lineLayer)
        this.server.map.add(markerLayer)
        markerLayer.when(() => {
          this.server.view.popup.close()
          this.server.view.goTo(markerLayer.source.items, {
            duration: 1000
          });
        })
    })
  }

  
  getCircleSymbol(size, color) {
    return {
      type: "simple-marker",
      color: color,
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
      size: size
    }
  }
  getMarkerSymbol(type) {
    return {
      type: type,  // autocasts as new PictureMarkerSymbol()
      color: [226, 119, 40],  // orange
      outline: {
        color: [255, 255, 255], // white
        width: 1
      }
    };
  }
  onMapComplete() {
    loadModules([
    ]).then(() => {
      //标记点击事件
      this.server.view.on('click', (event) => {
        this.server.view.hitTest(event).then((response) => {
          if (response.results[0].graphic.geometry && response.results[0].graphic.attributes.systemId) {
            const centerPoint = this.server.view.toScreen(this.server.view.center);
            const screenPoint = this.server.view.toScreen(event.mapPoint);
            let poorX = 0;
            let poorY = 0;
            if (screenPoint.x + 710 > document.body.clientWidth) {
              poorX = screenPoint.x + 750 - document.body.clientWidth
            }
            if (screenPoint.y < 305) {
              poorY = 305 - screenPoint.y;
            } else if (screenPoint.y + 210 > document.body.clientHeight) {
              poorY = document.body.clientHeight - screenPoint.y - 210;
            }
            const point = this.server.view.toMap({
              x: centerPoint.x + poorX,
              y: centerPoint.y - poorY
            });
            if (poorX || poorY) {
              this.server.view.goTo({
                center: [point.longitude, point.latitude],
              }, {
                duration: 1000  // Duration of animation will be 5 seconds
              });
            }
            this.activePoint = response.results[0].mapPoint;
            this.createHightGraphics({
              type: 'point',
              longitude: response.results[0].graphic.geometry.longitude,
              latitude: response.results[0].graphic.geometry.latitude,
              systemId: response.results[0].graphic.attributes.systemId,
              options: response.results[0].graphic.attributes.options,
              popupTemplate: response.results[0].graphic.popupTemplate
            }).subscribe(res => {

            })
          } else {
            return
          }

        })
      })
      //绑定地图移动事件
      this.server.view.on("pointer-move", (event) => {
        if (this.popVisible) {
          this.dealStyle()
        }
      });
      //地图放大事件
      this.server.view.watch("zoom", (event) => {
        if (this.popVisible) {
          this.dealStyle()
        }
      });
    })
  }
  //绘制点集
  createManyGraphics(systemObj) {
    return new Observable<any>((observer) => {
      loadModules([
        "esri/Graphic",
      ]).then(([Graphic]) => {
        let graphics = [];
        let graphic;
        systemObj.graphicList.forEach(marker => {
          if (marker.lon && marker.lat) {
            graphic = new Graphic(
              this.filtterGraphic(marker)
            )
            graphics.push(graphic);
          }
        });
        console.log(graphics)
        this.server.view.graphics.addMany(graphics);
        observer.next({
          message: '绘制完成',
          graphics: graphics
        });
      })
    })
  }
  createHightGraphics(graphic) {
    if (this.highLightCirle) {
      this.server.view.graphics.remove(this.highLightCirle);
    }
    return new Observable<any>((observer) => {
      loadModules([
        "esri/Graphic",
      ]).then(([Graphic]) => {
        this.highLightCirle = new Graphic(
          {
            geometry: {
              type: "point",
              longitude: graphic.longitude,
              latitude: graphic.latitude
            },
            symbol: {
              type: 'simple-marker',
              color: [4, 255, 255, 0.2],
              width: "24px",
              height: "24px",
              outline: graphic.outline || {
                color: [4, 255, 255, 1],
                width: 1
              }
            }
          }
        )
        this.server.view.graphics.add(this.highLightCirle);
        //显示弹框
        if (!graphic.popupTemplate) {
          this.popVisible = true;
          this.showPop.next(true);
          this.selectedPoint.next({
            systemId: graphic.systemId,
            options: graphic.options
          })
          this.dealStyle();
        } else {
          this.showPop.next(false);
        }
        observer.next({
          // message: '绘制完成'
        });
      })
    })
  }
  //移除点集合
  removeManyGraphics(markers: []) {
    markers.forEach(element => {
      this.server.view.graphics.remove(element);
    })
  }

  //graphic 筛选
  filtterGraphic(marker: Graphic) {
    let graphic;
    switch (marker.type) {
      //point
      case "point":
        graphic = {
          geometry: {
            type: "point",
            longitude: marker.longitude,
            latitude: marker.latitude,
          },
          symbol: {
            type: marker.symbolType,
            url: "../vmb/assets/images/" + marker.systemId + ".svg",
            width: "20px",
            height: "20px",
            color: marker.color || '#1890ff',
            outline: marker.outline || {
              color: [255, 255, 255],
              width: 2
            }
          },
          attributes: marker.attributes,
          popupTemplate: marker.popupTemplate ? marker.popupTemplate : null
        };
        break;

      default:
        break;
    }
    console.log(graphic)
    return graphic;
  }
  gotoPoint(item) {
    return new Observable<any>((observer) => {
      this.server.view.zoom = this.server.view.zoom > 12 ? this.server.view.zoom : 12;
      this.server.view.goTo({
        center: [Number(item.longitude), Number(item.latitude)],
        zoom: this.server.view.zoom
      }, {
        duration: 1000
      });
      observer.next();
      this.activePoint = this.server.view.toScreen(this.server.view.center);
    })
  }

  //处理弹框位置
  dealStyle() {
    //打开弹框
    let screenPoint = this.server.view.toScreen(this.highLightCirle.geometry);
    this.popoverStyle.next({
      left: (screenPoint.x + 30) + 'px',
      top: (screenPoint.y - 195) + 'px',
    })
  }


  
  //获取ais船舶
  getAisShipList() {
    let options = {
      origin:environmentProject.Origin,
      // api:'/api/ProjectManager/GetPorjectTreeWithCarriers',
      api: '/api/LocationData/GetCarrierLocationData',
      // origin:environment.APIAutoDeform,
      params: {
        // Rows:1000,
        // name:''
        Sidx: 0,
        Rows: 100
      }
    }
    this.server.getRxjsData(options).subscribe((data: any) => {
      // let xyList = data.data.aisLocationData
      this.AisDataState=true;
      this.AISDataList=data.data.aisLocationData
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
      const editThisAction = {
        title: "历史轨迹",
        id: "edit-guiji",
        className: "esri-icon-applications"
        // image: 'https://music.163.com/style/web2/img/mail/icn-pau.png'
      };

      const labelClass = {
        symbol: {
          type: "text",
          color: "green",
          haloColor: 'white',
          haloSize: 1,
          font: {
            size: 8,
            weight: "bold"
          },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "$feature.name"
        },
        maxScale: 0,
        minScale: 50000
      };
      const RENDERER_SHIP = {
        type: "unique-value",
        field: 'angle',
        defaultSymbol: {
          type: "picture-marker",
          url: "../vmb/assets/images/aisShip.svg",
          width: 10,
          height: 20,
          angle: 0
        },
        uniqueValueInfos: []
      }
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

      let tempAngleSymbol = []
      for (let i = 0; i < 360; i++) {
        tempAngleSymbol.push({
          value: i,
          symbol: {
            type: "picture-marker",
            url: "../vmb/assets/images/aisShip.svg",
            width: 10,
            height: 20,
            angle: i
          }
        })
      }
      RENDERER_SHIP.uniqueValueInfos = tempAngleSymbol

      const popupTemplate_ship = {
        title: "{name}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "name",
            label: "名称",
            format: {
              places: 0,
              digitSeparator: true
            }
          }, {
            fieldName: "mmsi",
            label: "MMSI",
            format: {
              places: 0,
              digitSeparator: true
            }
          }, {
            fieldName: "angle",
            label: "  航向",
            format: {
              places: 0,
              digitSeparator: true
            }
          }, {
            fieldName: "rot",
            label: "转速",
            format: {
              places: 0,
              digitSeparator: true
            }
          }, {
            fieldName: "lon",
            label: "经度",
            format: {
              places: 5,
              digitSeparator: true
            }
          }, {
            fieldName: "lat",
            label: "纬度",
            format: {
              places: 5,
              digitSeparator: true
            }
          }, {
            fieldName: "lastestTime",
            label: "时间",
            format: {
              places: 5,
              digitSeparator: true
            }
          },]
        }],
        actions: [editThisAction]
      };

      const shipLayerField = [{
        name: "OJBEDTID",
        alias: "OJBEDTID",
        type: "oid"
      }, {
        name: "name",
        alias: "name",
        type: "string"
      }, {
        name: "angle",
        alias: "angle",
        type: "double"
      }, {
        name: "lon",
        alias: "lon",
        type: "double"
      }, {
        name: "lat",
        alias: "lat",
        type: "double"
      }, {
        name: "type",
        alias: "type",
        type: "string"
      }, {
        name: "lastestTime",
        alias: "lastestTime",
        type: "string"
      }, {
        name: "mmsi",
        alias: "mmsi",
        type: "double"
      }, {
        name: "navigationStatus",
        alias: "navigationStatus",
        type: "string"
      }, {
        name: "rot",
        alias: "rot",
        type: "double"
      }, {
        name: "sog",
        alias: "sog",
        type: "double"
      }]
      // this.server.map.remove(this.server.map.findLayerById('AIS_ShipLayer'))
      this.createFeatureLayer('AIS_ShipLayer', shipLayerField, popupTemplate_ship, labelClass, RENDERER_CIRCLE, RENDERER_SHIP, features)
    })
  }


}
