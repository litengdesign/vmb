import { Component, OnInit, Output, EventEmitter, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServersService } from '../../servers.service';
import { environment, environmentVolum } from '../../../environments/environment';
import { loadModules } from 'esri-loader';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProjectPageService } from '../../pages/project-page/project-page.service';
import { MapService } from '../../services/map.service';
import { forkJoin } from 'rxjs';
import { differenceInCalendarDays, setHours, setDay, addDays, format } from 'date-fns';
@Component({
  selector: 'app-system-list',
  templateUrl: './system-list.component.html',
  styleUrls: ['./system-list.component.less']
})
export class SystemListComponent implements OnInit {

  public apiAllFenceInfo = '/api/FencesInfo/GetAllFenceInfo'; // 获取电子围栏列表
  public apiAllRouteInfo = '/api/RouteManage/GetRouteInfo'; // 获取路线列表
  public apiGetFencesByCarrier = '/api/FencesInfo/GetFencesByCarrier'; // 按照终端ID获取终端关联的所有电子围栏(显示防区)
  // 终端关联航线
  public apiGetRoutesByCarrier = '/api/RouteManage/GetRoutesByCarrier'; // 按照终端ID获取终端关联的所有路线围栏(显示防区)
  public projectInfo: any = JSON.parse(sessionStorage.getItem('projectInfo')); // 获取工程信息
  public apiGetShipList = '/api/Common/GetShipList'; // 获取船舶下拉列表数据
  public systemList: any[] = [
    {
      name: '自动化变形监测',
      id: 'ADS',
      disable: false,
      origin: environment.APIAutoDeform,
      icon: 'icon-zidongjiancezhan',
      viewMapVisible: true, // 是否在地图显示
      collapsible: false, // 是否收起
      searchVisible: false,
      header: '测点列表',
      hasSearch: false,
      api: '/api/DeviceManage/GetDevivceList', // 获取测点列表
      detailAPI: '/api/DeviceManage/GetDevice', // 获取特定测点
      data: [],
      list: [],
      graphicList: [],
      options: {
        origin: environment.APIAutoDeform,
        api: '/api/DeviceManage/GetDevice'
      },
    }, {
      name: '生产调度系统',
      id: 'PSS',
      disable: true,
      url: environment.APISmartLocation,
      icon: 'icon-shengchantiaodu',
      origin: environment.APISmartLocation,
      viewMapVisible: true,
      viewMapAisVisible: false,
      collapsible: false,
      searchVisible: false,
      childPanel: [
        {
          header: '载具列表',
          shipLayerVisible: true,
          hasSearch: false,
          api: '/api/LocationData/GetCarrierLocationData',
          api_detail: '/api/DeviceManage/GetDevice',
          data: [],
          list: [],
          graphicList: [],
        }
      ],
      header: '载具列表',
      shipLayerVisible: true,
      hasSearch: false,
      searchKeyword: '',
      viewMapDisable: true,
      api: '/api/LocationData/GetCarrierLocationData',
      data: [],
      list: [],
      graphicList: [],
      options: {
        origin: environment.APIAutoDeform,
        api: '/api/DeviceManage/GetDevice'
      }
    },
    {
      name: '考勤管理系统',
      id: 'Check',
      disable: false,
      url: environment.APICheck,
      origin: environment.APICheck,
      description: '考勤管理系统',
      type: '安全监管类',
      icon: 'icon-kaoqin1',
      viewMapVisible: true,
      collapsible: false,
      searchVisible: false,
      childPanel: [
        {
          header: '打卡点列表',
          hasSearch: false,
          api: '/api/CheckPoint/GetCheckPointList',
          data: [],
          list: [],
          graphicList: [],
        }
      ],
      header: '打卡点列表',
      hasSearch: false,
      api: '/api/CheckPoint/GetCheckPointList',
      data: [],
      list: [],
      graphicList: [],
      options: {
        origin: environment.APICheck,
        api: '/api/DeviceManage/GetDevice'
      },
    },
    {
      name: '激光量方',
      id: 'Volume',
      disable: true,
      url: environmentVolum.Origin,
      icon: 'icon-beibaoguanli',
      origin: environmentVolum.Origin,
      viewMapVisible: false,
      viewMapAisVisible: false,
      collapsible: true,
      searchVisible: false,
      header: '载具列表',
      shipLayerVisible: false,
      hasSearch: true,
      viewMapDisable: false,
      searchKeyword: '',
      api: '/api/Common/GetShipList',
      data: [],
      list: [],
      graphicList: [],
      options: {
        origin: environment.APIAutoDeform,
        api: '/api/DeviceManage/GetDevice'
      }
    },
  ];
  public autodeformPointGraphics = [];
  // popup params
  public popoverStyle = {};
  public activePoint = {};
  public showPop = false;
  public isVisibleStatistical = false;
  public checkRecord: any = {};
  // 打卡统计分析图标
  public chartData = {
    constructionXAxis: [],
    constructionData: []
  };
  public activeChart = 1;
  public chartOption: any = {
    isVisableClear: true
  };
  public chartSpinning = false;
  public pssData: any = {
    ship: [],
    vehicle: [],
    fenceList: [],
    routeList: [],

  };
  // 终端关联电子围栏
  public totalFencesByCarrier = 0;
  public displayDataFencesByCarrier: any = []; // 存储列表数据
  public colDataFencesByCarrier = null;
  public pageIndexFencesByCarrier = 1;
  public pageSizeFencesByCarrier = 10;
  public openFencesByCarrier = false;
  public fenceType = '';
  public number = 0;

  public noProject = false;
  public pageLoading = true;
  // 方量相关参数
  public isVisibleVolumeStatistical = false;
  public api_list = '/api/VolumeStatistics/GetVolumeDataByMonth'; // 按月获取图表数据
  public api_list_day = '/api/VolumeStatistics/GetVolumeDataByDay'; // 按天搜索图表数据
  public api_list_ship = '/api/VolumeStatistics/GetShipVolumeData'; // 按船搜索图表数据
  public isLoading = false; // 用于加载效果
  public Page = 1;          // 初始页码
  public Rows = 13;         // 显示行数
  public total = 1;         // 总条数
  public Sord = null;       // 正反序
  public OrderBy = null;    // 排序字段
  public loading = true;    // 开启加载
  public Sidx = '0';        // 排序字段
  public colData = null;
  public chartDataShip =  {}; // 施工 船舶图表数据
  public chartDataVolume: any  = {}; // 图表数据
  public listOfAllData: any[] = [];
  public projects =  []; // 项目列表
  public ProjectId = null; // 项目1
  public ProjectId1 = null; // 项目2
  public selectedShip;
  // 其他参数
  public defaultSelectDate = [format(addDays(new Date(), -365), 'YYYY-MM-DD'), format(new Date(), 'YYYY-MM-DD')];
  public shipId = null;
  public ships: any[] = [];
  public searchType = 'month'; // 默认搜索方式
  public showDay = format(new Date(), 'YYYY-MM-DD');
  public isLoadingOne = false;
  public isLoadingTwo = false;
  public nzFormat = 'yyyy/MM/dd';
  // 安全隐患排查
  public hdi = {
    collapsible: true,
    list: []
  };
  constructor(
    public server: ServersService,
    public activatedRoute: ActivatedRoute,
    public projectPageService: ProjectPageService,
    private message: NzMessageService,
    public mapServer: MapService
  ) {
    this.ProjectId = this.projectInfo.projectId;
    this.ProjectId1 = this.projectInfo.projectId;
    // 判断map是否加载完成
    this.projectPageService.subjectMapStatus.subscribe(res => {
      if (res) {
        this.number++;
      }
      if (this.number === 1) {
        this.getAutoDeform();
        if (this.projectInfo.id === 'fc3f255c-cba0-490f-9c2e-a32146387ab9') {
          // this.getCheckPointList();
          this.getCheckWorkPoint();
        }
        // 获取智能位置数据
        this.getPssData();
        // 获取量方船舶数据
        this.getVolumeData();
      }
    });
  }

  ngOnInit() {
    this.getHidList();
  }
  // 获取生产运维数据
  getPssData() {
    // 获取电子围栏
    const fenceInfo = this.server.forkRxjsData({
      api: this.apiAllFenceInfo,
      params: {
        fenceType: '24a9d240-e5ec-4073-b73a-08d74e18b561'
      }
    });
    // 获取路线列表
    const routerInfo = this.server.forkRxjsData({
      api: this.apiAllRouteInfo,
      params: {
        fenceType: '9d663eba-8532-406e-b73b-08d74e18b561'
      }
    });

    // 获取北斗船舶
    const shipList = this.server.forkRxjsData({
      origin: environment.APISmartLocation,
      api: '/api/ProjectManager/GetPorjectTreeWithCarriers',
      params: {
        name: this.projectInfo.name,
        Sidx: 0,
        Rows: 1,
      }
    });
    forkJoin([fenceInfo, routerInfo, shipList]).subscribe((result: any) => {
      this.pssData.fenceList  = [];
      result[0].data.forEach(element => {
        if (element.projectId === this.projectInfo.id) {
          this.pssData.fenceList.push(element);
        }
      });
      this.pssData.routeList = [];
      // 绘制多边形
      this.addFenceGeometry(this.pssData.fenceList, this.pssData.routeList);
      this.pssData.ship = result[2].pageResult.data[0] ? result[2].pageResult.data[0].children.ship : [];
      this.pssData.vehicle = result[2].pageResult.data[0] ? result[2].pageResult.data[0].children.vehicle : [];
      const featuresShip = [];
      const featuresVehicle = [];
      if (result[2].pageResult.data) {
        for (const item of this.pssData.ship) {
          if (item.lon && item.lat) {
              featuresShip.push({
              geometry: {
                type: 'point',
                x: item.lon,
                y: item.lat
              },
              attributes: {
                // tslint:disable-next-line: radix
                OJBEDTID: parseInt(item.cardNumber),
                name: item.carrierName,
                type: 'ship',
                lon: item.lon,
                lat: item.lat,
                angle: item.course,
                companyName: item.companyName,
                projectName: item.projectName,
                typeName: item.typeName,
                cardNumber: item.cardNumber,
                dataTime: format(item.dataTime, 'YYYY-MM-DD HH:mm:ss'),
                carrierId: item.carrierId
              }
            });
          }
        }
        for (const i of this.pssData.vehicle) {
          if (i.lon && i.lat) {
            featuresVehicle.push({
              geometry: {
                type: 'point',
                x: i.lon,
                y: i.lat
              },
              attributes: {
                // tslint:disable-next-line: radix
                OJBEDTID:  parseInt(i.cardNumber),
                name: i.carrierName,
                type: 'Vehicle',
                lon: i.lon,
                lat: i.lat,
                angle: i.course,
                companyName: i.companyName,
                projectName: i.projectName,
                typeName: i.typeName,
                cardNumber: i.cardNumber,
                dataTime: i.dataTime,
                carrierId: i.carrierId
              }
            });
          }
        }
      }
      if (this.server.map.findLayerById('Vehicle_Layer')) {
        this.server.map.remove(this.server.map.findLayerById('Vehicle_Layer'));
      }
      if (this.server.map.findLayerById('BD_ShipLayer')) {
        this.server.map.remove(this.server.map.findLayerById('BD_ShipLayer'));
      }
      this.createShipLayer('BD_ShipLayer', 'bdShip', featuresShip);
      this.createShipLayer('Vehicle_Layer', 'ADS', featuresVehicle);
      if (this.pssData.ship.length || this.pssData.vehicle.length || this.pssData.fenceList.length || this.pssData.routeList.length) {
        this.systemList[1].collapsible  = true;
        this.systemList[1].viewMapDisable = false;
      } else {
        this.systemList[1].collapsible  = false;
        this.systemList[1].viewMapDisable = true;
      }
      this.ifNoProject();
    });
  }
  // 获取变形监测测点信息
  getAutoDeform(): void {
    this.projectInfo = JSON.parse(sessionStorage.getItem('projectInfo')); // 获取工程信息
    const projects = this.server.getProjects();
    forkJoin([projects]).subscribe((result: any) => {
      this.projects = result[0].pageResult.data;
    });
    const options = {
      origin: this.systemList[0].origin,
      api: this.systemList[0].api,
      params: {
        ProjectId: this.projectInfo.id,
        Sidx: '0'
      }
    };
    this.server.getRxjsData(options).subscribe(data => {
      this.systemList[0].graphicList = [];
      if (data.data.length) {
        this.systemList[0].collapsible = true;
      }
      data.data.forEach(item => {
        this.systemList[0].graphicList.push({
          type: 'point',
          symbolType: 'picture-marker',
          longitude: item.lon,
          latitude: item.lat,
          attributes: {
            name: item.deviceName,
            id: item.deviceId,
            icon: 'icon-dibiaoshuishuizhijiancezhan',
            systemId: this.systemList[0].id,
            options: {
              origin: environment.APIAutoDeform,
              api: '/api/DeviceManage/GetDevice',
              params: {
                id: item.deviceId
              }
            }
          },
          systemId: this.systemList[0].id
        });
      });
      this.systemList[0].list = this.systemList[0].graphicList;
      this.mapServer.removeManyGraphics(this.systemList[0].graphicList);
      this.mapServer.createManyGraphics(this.systemList[0]).subscribe(res => {
        this.systemList[0].graphics = res.graphics;
      });
    });
  }
  // 香港考勤打卡开关
  visibleCheckChange(event, system) {
    if (this.server.map.findLayerById('Work_Layer')) {
      this.server.map.findLayerById('Work_Layer').visible = event;
      if (!event) {
        this.server.view.popup.close();
      }
    } else {
      if (event) {
        this.mapServer.createManyGraphics(system).subscribe(res => {
          system.graphics = res.graphics;
        });
      } else {
        this.mapServer.removeManyGraphics(system.graphics);
      }
    }

  }
  // 获取点详情
  getPointDetail(item, system) {
    item.moveing = true;
    item.options = {
      origin: system.origin,
      api: system.detailAPI,
      params: {
        id: item.attributes.id
      }
    };
    // 列表高亮
    system.list.forEach(element => {
      element.active = false;
      if (element.attributes.id === item.attributes.id) {
        element.active = true;
      }
    });
    this.mapServer.gotoPoint(item).subscribe(res => {
      this.mapServer.createHightGraphics(item).subscribe();
    });
  }
  // 获取香港考勤打卡点
  getCheckPointList() {
    const options = {
      origin: this.systemList[2].options.origin,
      api: this.systemList[2].api,
      params: {
        Sidx: '0'
      }
    };
    this.server.getRxjsData(options).subscribe(data => {
      this.mapServer.removeManyGraphics(this.systemList[2].graphicList);
      this.systemList[2].graphicList = [];
      if (data.data.length) {
        this.systemList[2].collapsible = true;
      }
      data.data.forEach(item => {
        this.systemList[2].graphicList.push({
          type: 'point',
          symbolType: 'picture-marker',
          longitude: item.lon,
          latitude: item.lat,
          attributes: {
            name: item.pointName,
            id: item.id,
            icon: 'icon-qiandao-kaoqindaqia',
            systemId: this.systemList[2].id,
            options: {
              params: {
                id: item.id
              }
            },
          },
          systemId: this.systemList[2].id,
          popupTemplate: {
            // autocasts as new PopupTemplate()
            title: item.pointName,
            content: `经度：${item.lon}，纬度：${item.lat}`,
          }
        });
      });
      this.systemList[2].list = this.systemList[2].graphicList;
      this.mapServer.createManyGraphics(this.systemList[2]).subscribe(res => {
        this.systemList[2].graphics = res.graphics;
      });
      this.ifNoProject();
    });
  }
  // 显示弹框
  showModal(): void {
    this.chartSpinning = true;
    this.isVisibleStatistical = true;
    const options = {
      origin: environment.APICheck,
      api: '/api/CheckRecord/GetNum',
    };
    this.server.getRxjsData(options).subscribe(data => {
      this.checkRecord = data.data;
      this.createEchart();
    });

  }
  // 打卡统计
  setActiveChart(key) {
    this.activeChart = key;
    this.createEchart();
  }
  // 创建图表
  createEchart() {
    this.chartData.constructionXAxis = [];
    this.chartData.constructionData = [];
    if (this.activeChart === 1) {
      this.checkRecord.presences.constructionAreaInfo.forEach(item => {
        this.chartData.constructionXAxis.push(item.constructionAreaName);
        this.chartData.constructionData.push(item.numWorker);
      });
    } else {
      this.checkRecord.presences.subcontractorInfo.forEach(item => {
        this.chartData.constructionXAxis.push(item.subcontractorName);
        this.chartData.constructionData.push(item.numWorker);
      });
    }
    this.chartOption = {
      isVisableClear: false,
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.chartData.constructionXAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          barWidth: '40%',
          barMaxWidth: '30',
          data: this.chartData.constructionData
        }
      ]
    };
    this.chartSpinning = false;
  }
  // 隐藏打卡统计弹框
  handleCancel(): void {
    this.isVisibleStatistical = false;
  }
  // 获取打卡点列表
  getCheckWorkPoint() {
    const options = {
      origin: this.systemList[2].options.origin,
      api: this.systemList[2].api,
      params: {
        Sidx: '0'
      }
    };
    this.server.getRxjsData(options).subscribe(data => {
      const features = [];
      if (data.data.length) {
        this.systemList[2].collapsible = true;
      }
      for (const item of data.data) {
        if (item.lon && item.lat) {
          features.push({
            geometry: {
              type: 'point',
              x: item.lon,
              y: item.lat
            },
            attributes: {
              // tslint:disable-next-line: radix
              OJBEDTID:  parseInt(item.code),
              lon: item.lon,
              lat: item.lat,
              name: item.pointName
            }
          });
        }
      }
      this.systemList[2].list = features;
      if (this.server.map.findLayerById('Work_Layer')) {
        this.server.map.remove(this.server.map.findLayerById('Work_Layer'));
      }
      this.ifNoProject();
      this.createShipLayer('Work_Layer', 'Check', features);
    });
  }
  // 获取项目船舶
  getProjectShipList() {
    const options = {
      api: '/api/ProjectManager/GetPorjectTreeWithCarriers',
      params: {
        name: this.projectInfo.name,
        Sidx: 0,
        Rows: 1,
      }
    };
    this.server.getRxjsData(options).subscribe((data: any) => {
      this.pssData.ship = data.pageResult.data[0] ? data.pageResult.data[0].children.ship : [];
      this.pssData.vehicle = data.pageResult.data[0] ? data.pageResult.data[0].children.vehicle : [];
      const featuresShip = [];
      const featuresVehicle = [];
      if (data.pageResult.data) {
        for (const item of this.pssData.ship) {
          if (item.lon && item.lat) {
              featuresShip.push({
              geometry: {
                type: 'point',
                x: item.lon,
                y: item.lat
              },
              attributes: {
                // tslint:disable-next-line: radix
                OJBEDTID: parseInt(item.carrierId),
                name: item.carrierName,
                type: 'ship',
                lon: item.lon,
                lat: item.lat,
                angle: item.course,
                companyName: item.companyName,
                projectName: item.projectName,
                typeName: item.typeName,
                cardNumber: item.cardNumber,
                dataTime: format(item.dataTime, 'YYYY-MM-DD HH:mm:ss'),
                carrierId: item.carrierId
              }
            });
          }
        }
        for (const i of this.pssData.vehicle) {
          if (i.lon && i.lat) {
            featuresVehicle.push({
              geometry: {
                type: 'point',
                x: i.lon,
                y: i.lat
              },
              attributes: {
                OJBEDTID:  parseInt(i.carrierId),
                name: i.carrierName,
                type: 'Vehicle',
                lon: i.lon,
                lat: i.lat,
                angle: i.course,
                companyName: i.companyName,
                projectName: i.projectName,
                typeName: i.typeName,
                cardNumber: i.cardNumber,
                dataTime: i.dataTime,
                carrierId: i.carrierId
              }
            });
          }
        }
      }
      if (this.server.map.findLayerById('Vehicle_Layer')) {
        this.server.map.remove(this.server.map.findLayerById('Vehicle_Layer'));
      }
      if (this.server.map.findLayerById('BD_ShipLayer')) {
        this.server.map.remove(this.server.map.findLayerById('BD_ShipLayer'));
      }
      this.createShipLayer('BD_ShipLayer', 'bdShip', featuresShip);
      this.createShipLayer('Vehicle_Layer', 'ADS', featuresVehicle);
    });
  }
  // 图层控制
  visibleBDChange(e) {
    this.server.map.findLayerById('fenceLayer').visible = e;
    this.server.map.findLayerById('BD_ShipLayer').visible = e;
    this.server.map.findLayerById('Vehicle_Layer').visible = e;
    this.server.view.popup.close();
  }
  // 定位到点
  locationToMarker(item, layerID) {
    const query = {
      objectIds: layerID == 'Work_Layer' ? item.attributes.OJBEDTID : parseInt(item.cardNumber),
      outFields: ['*'],
      returnGeometry: true
    };
    this.server.view.whenLayerView(this.server.map.findLayerById(layerID)).then((featureLayerView) => {
          featureLayerView.queryFeatures(query).then((result) => {
            console.log(result);
              if (result.features.length == 0) {
                this.message.info('暂无位置信息！');
              } else {
                this.addGraphics(result);
              }
          });
          // 载具关联电子围栏
          this.server.view.popup.on('trigger-action', (event) => {
            switch (event.action.id) {
              case 'fenceIcon':
              this.openPoly(event.target.features[0].attributes.carrierId, 'fence');
              break;
              case 'routeIcon':
              this.openPoly(event.target.features[0].attributes.carrierId, 'route');
              break;
            }
          });
    });
  }
  // 创建点
  addGraphics(result) {
    result.features.forEach((feature) => {
        this.server.view.popup.open({
          features: [feature],
          location: [feature.attributes.lon, feature.attributes.lat],
          highlightEnabled: true
        });
        this.server.view.goTo({
          center: [feature.attributes.lon, feature.attributes.lat],
          zoom: 17
        }, { duration: 1500 });
    });
  }
  // 创建要素
  createShipLayer(layerID, imgName, features) {
    loadModules([
      'esri/renderers/SimpleRenderer',
    ]).then(([
      SimpleRenderer
    ]) => {
      const labelClass = {
        symbol: {
          type: 'text',
          color: 'green',
          haloColor: 'white',
          haloSize: 1,
          font: {
            size: 8,
            weight: 'bold'
          },
        },
        labelPlacement: 'above-center',
        labelExpressionInfo: {
          expression: '$feature.name'
        },
        maxScale: 0,
        minScale: 50000
      };
      const RENDERER_SHIP = {
        type: 'unique-value',
        field: 'angle',
        defaultSymbol: {
          type: 'picture-marker',
          url: `assets/images/${imgName}.svg`,
          width: layerID == 'Work_Layer' ? 20 : 10,
          height: 20,
          angle: 0
        },
        uniqueValueInfos: []
      };
      const RENDERER_CIRCLE = new SimpleRenderer({
        symbol: {
          type: 'simple-marker',
          color: 'green',
          outline: {
            color: [255, 255, 255, 0.7],
            width: 0.5
          },
          size: 15
        }
      });

      const tempAngleSymbol = [];
      for (let i = 0; i < 360; i++) {
        tempAngleSymbol.push({
          value: i,
          symbol: {
            type: 'picture-marker',
            url: `assets/images/${imgName}.svg`,
            width: 10,
            height: 20,
            angle: i
          }
        });
      }
      RENDERER_SHIP.uniqueValueInfos = tempAngleSymbol;

      const editThisAction = {
        title: '历史轨迹',
        id: 'edit-guiji',
        className: 'esri-icon-applications'
      };

      let popupTemplate_BDship = {
      title: '{name}',
      actions: [
        {
          title: ' 关联防区',
          id: 'fenceIcon',
        },
        {
          title: ' 关联路线',
          id: 'routeIcon',
        }, editThisAction
      ],
      content: [{
          type: 'fields',
          fieldInfos: [{
              fieldName: 'name',
              label: '名称',
              format: {
                  places: 0,
                  digitSeparator: true
              }
          }, {
              fieldName: 'projectName',
              label: '项目名称',
              format: {
                  places: 0,
                  digitSeparator: true
              }
          }, {
              fieldName: 'angle',
              label: '航向',
              format: {
                  places: 0,
                  digitSeparator: true
              }
          }, {
              fieldName: 'companyName',
              label: '所属单位',
              format: {
                  places: 0,
                  digitSeparator: true
              }
          }, {
              fieldName: 'lon',
              label: '经度',
              format: {
                  places: 5,
                  digitSeparator: true
              }
          }, {
              fieldName: 'lat',
              label: '纬度',
              format: {
                  places: 5,
                  digitSeparator: true
              }
          }, {
            fieldName: 'dataTime',
            label: '时间',
            format: {
                places: 5,
                digitSeparator: true
            }
        },
      //   {
      //     fieldName: "typeName",
      //     label: "类型名称",
      //     format: {
      //         places: 5,
      //         digitSeparator: true
      //     }
      // }
    ]
    }]
  };
      let shipLayerField = [{
        name: 'OJBEDTID',
        alias: 'OJBEDTID',
        type: 'string'
      }, {
        name: 'name',
        alias: 'name',
        type: 'string'
      }, {
        name: 'angle',
        alias: 'angle',
        type: 'double'
      }, {
        name: 'lon',
        alias: 'lon',
        type: 'double'
      }, {
        name: 'lat',
        alias: 'lat',
        type: 'double'
      }, {
        name: 'type',
        alias: 'type',
        type: 'string'
      }, {
        name: 'dataTime',
        alias: 'dataTime',
        type: 'string'
      }, {
        name: 'carrierId',
        alias: 'carrierId',
        type: 'string'
      }, {
        name: 'projectName',
        alias: 'projectName',
        type: 'string'
      }, {
        name: 'companyName',
        alias: 'companyName',
        type: 'string'
      }, {
        name: 'cardNumber',
        alias: 'cardNumber',
        type: 'string'
      }, {
        name: 'typeName',
        alias: 'typeName',
        type: 'string'
      }];
      if (layerID === 'Work_Layer') {
         popupTemplate_BDship = {
          title: '{name}',
          actions: [],
          content: [{
              type: 'fields',
              fieldInfos: [{
                  fieldName: 'name',
                  label: '名称',
                  format: {
                      places: 0,
                      digitSeparator: true
                  }
              }, {
                  fieldName: 'lon',
                  label: '经度',
                  format: {
                      places: 5,
                      digitSeparator: true
                  }
              }, {
                  fieldName: 'lat',
                  label: '纬度',
                  format: {
                      places: 5,
                      digitSeparator: true
                  }
              }]
        }]
      };
         shipLayerField = [{
        name: 'OJBEDTID',
        alias: 'OJBEDTID',
        type: 'string'
      }, {
        name: 'name',
        alias: 'name',
        type: 'string'
      }, {
        name: 'lon',
        alias: 'lon',
        type: 'double'
      }, {
        name: 'lat',
        alias: 'lat',
        type: 'double'
      }
       ];
      }
      this.mapServer.createFeatureLayer(
        layerID, shipLayerField, popupTemplate_BDship, labelClass, RENDERER_CIRCLE, RENDERER_SHIP, features);
    });
  }
  // 绘制电子围栏
  addFenceGeometry(fenceList, routeList) {
    if (this.server.map.findLayerById('fenceLayer')) {
        this.server.map.remove(this.server.map.findLayerById('fenceLayer'));
    }
    loadModules([
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/geometry/Circle'
    ]).then(([
      GraphicsLayer,
      Graphic,
      Circle
    ]) => {
      const graphicsLayer = new GraphicsLayer({ id: 'fenceLayer' });
      this.server.map.add(graphicsLayer);
      const popupTemplate = {
        title: '{Name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [{
                label: '名称',
                fieldName: 'Name'
              },
              { label: '所属项目',
                fieldName: 'projectName'
              },
              { label: '缓冲区范围',
              fieldName: 'bufferRange'
              },
              { label: '创建时间',
                fieldName: 'createTime'
              }
            ]
          }
        ],
      };
      const fillSymbol = {
        type: 'simple-fill',
        style: 'diagonal-cross',
        outline: {
          cap: 'square',
          join: 'bevel',
          miterLimit: 17,
          width: 1.5,
          color: [255, 0, 0, 1]
        },
        color: [255, 0, 0, 0.37]
      };

      const lineSymbol = {
        type: 'simple-line', // solid
        style: 'short-dash',
        cap: 'square',
        width: 2,
        color: [255, 0, 0, 1]
      };

      const createAttr = (item) => {
        return {
          OJBEDTID: item.id,
          Name: item.name,
          projectName: item.projectName,
          createTime: format(item.createTime, 'YYYY-MM-DD'),
          bufferRange: item.bufferRange
        };
      };
      const createGraphic = (geometry, symbol, attr, popupTemplate) => {
        return new Graphic({
          geometry,
          symbol,
          attributes: attr,
          popupTemplate
        });
      };
      const createLine = (item) => {
        const polyline = {
          type: 'polyline',
          paths: JSON.parse(item.frontierPoint)
        };
        const Attr = createAttr(item);
        graphicsLayer.add(createGraphic(polyline, lineSymbol, Attr, popupTemplate) );
      };
      const createPolygon = (item) => {
        const polygon = {
          type: 'polygon',
          rings: JSON.parse(item.frontierPoint)
        };
        const Attr = createAttr(item);
        graphicsLayer.add(createGraphic(polygon, fillSymbol, Attr, popupTemplate));
      };
      const createCircle = (item) => {
        const arg = JSON.parse(item.frontierPoint);
        const circle = new Circle({
          geodesic: true,
          center: arg.center,
          radius: arg.radius,
          spatialReference: {
            wkid: 3857
          }
        });
        const Attr = createAttr(item);
        graphicsLayer.add(createGraphic(circle, fillSymbol, Attr, popupTemplate));
      };
      for (var fence of fenceList) {
        if (fence.fenceShape == 'polygon') {
          createPolygon(fence);
        } else if (fence.fenceShape == 'circle') {
          createCircle(fence);
        }
      }
      for (var route of routeList) {
        createLine(route);
      }
    });
  }
  // 定位电子围栏
  locationToFenceExtend(item) {
    const fs = this.server.map.findLayerById('fenceLayer').graphics.items;
    for (const f of fs) {
      if (f.attributes.OJBEDTID == item.id) {
        this.server.view.extent = f.geometry.extent;
        this.server.view.zoom = this.server.view.zoom - 1;
        this.server.view.popup.open({
          features: [f],
          location: [f.geometry.extent.center.longitude, f.geometry.extent.center.latitude],
          highlightEnabled: true
        });
      }
    }
  }
  // 显示载具关联电子围栏
  openPoly(carrierId, fenceType) {
    this.fenceType = fenceType;
    const options = {
      origin: environment.APISmartLocation,
      api: fenceType === 'fence' ? this.apiGetFencesByCarrier : this.apiGetRoutesByCarrier,
      params: {
        carrierId,
        fenceType: fenceType === 'fence' ? '24a9d240-e5ec-4073-b73a-08d74e18b561' : '9d663eba-8532-406e-b73b-08d74e18b561',
      }
    };
    this.server.getRxjsData(options).subscribe((data) => {
      this.totalFencesByCarrier = data.total;
      this.colDataFencesByCarrier = data.data;
      this.displayDataFencesByCarrier = [...this.colDataFencesByCarrier];
      this.openFencesByCarrier = true;
    });
  }
  // 判断是否存在项目
  ifNoProject() {
    if (!this.systemList[2].collapsible && !this.systemList[1].collapsible && !this.systemList[0].collapsible) {
      this.noProject = true;
      this.pageLoading = false;
    } else {
      this.noProject = false;
      this.pageLoading = false;
    }
  }
  // 获取激光量方船舶数据
  getVolumeData() {
    const options = {
      origin: environmentVolum.Origin,
      api: this.apiGetShipList,
      params: {
        Page: 1,
        Rows: 1000,
        ProjectId: this.projectInfo.projectId
      }
    };
    this.server.getRxjsData(options).subscribe(res => {
      this.systemList[3].list = res.pageResult.data;
      this.ships = this.systemList[3].list;
    });
  }
  // 获取方量详情
  getShipVolume(item) {
    this.selectedShip = item.name;
    this.shipId = item.shipId;
    this.getDataList();
   }
  // 获取图表数据(默认按月)
  getDataList() {
    this.isLoadingOne = true;
    this.loading = true;
    const params: any = {};
    params.projectId = this.projectInfo.projectId;
    params.shipId = this.shipId;
    switch (this.searchType) {
      case 'month':
        params.startTime = format(this.defaultSelectDate[0], 'YYYY-MM');
        params.endTime = format(this.defaultSelectDate[1], 'YYYY-MM');
        break;
      case 'day':
        params.startTime = format(addDays(new Date(), -31), 'YYYY-MM-DD');
        params.endTime = format(this.defaultSelectDate[1], 'YYYY-MM-DD');
        break;
      default:
        break;
    }
    const options: any = {
      origin: environmentVolum.Origin,
      api: this.searchType === 'month' ? this.api_list : this.api_list_day,
      params
    };
    this.server.getRxjsData(options).subscribe((data) => {
      this.isLoadingOne = false;
      let obj = {};
      switch (this.searchType) {
        case 'month':
          obj = {
            title: {
              text: '运砂量统计(月)'
            },
            zoomType: 'xy',
            xAxis: [{
              categories: data.data.barChartData.xAxis,
              crosshair: true
            }],
            yAxisText: '产量（万m³）',
            yAxis: [{ // Primary yAxis
              labels: {
                format: '{value}',
                style: {
                  color: '#1c2b36'
                }
              },
              title: {
                text: '产量（万m³）',
                style: {
                  color: '#1c2b36'
                }
              }
            }, { // Secondary yAxis
              title: {
                text: '累计（万m³）',
                style: {
                  color: '#1c4893'
                }
              },
              labels: {
                format: '{value}',
                style: {
                  color: '#1c4893'
                }
              },
              opposite: true
            }],
            tooltip: {
              shared: true
            },
            legend: {
              layout: 'vertical',
              align: 'left',
              x: 120,
              verticalAlign: 'top',
              y: 100,
              floating: true,
              backgroundColor: '#FFFFFF'
            },
            seriesList: [
              {
                name: '产量',
                type: 'column',
                data: data.data.barChartData.series[0].data,
                tooltip: {
                  valueSuffix: ' 万m³'
                },
                maxPointWidth: 40,
                dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.2f}', // :.1f 为保留 1 位小数
                  y: 10
                },
                color: '#1890ff'
              },
              {
                name: '累计',
                type: 'spline',
                yAxis: 1,
                data: data.data.lineChartData[0].data,
                tooltip: {
                  valueSuffix: ' 万m³'
                },
                color: '#1c4893'
              }
            ],
          };
          break;
        case 'day':
          obj = {
            title: {
              text: '运砂量统计(日)'
            },
            zoomType: 'xy',
            xAxis: [{
              categories: data.data.xAxis,
              crosshair: true
            }],
            yAxisText: '产量（万m³）',
            yAxis: [{ // Primary yAxis
              labels: {
                format: '{value}',
                style: {
                  color: '#1c2b36'
                }
              },
              title: {
                text: '产量（万m³）',
                style: {
                  color: '#1c2b36'
                }
              }
            }],
            tooltip: {
              shared: true
            },
            legend: {
              layout: 'vertical',
              align: 'left',
              x: 120,
              verticalAlign: 'top',
              y: 100,
              floating: true,
              backgroundColor: '#FFFFFF'
            },
            seriesList: [
              {
                name: '产量',
                type: 'column',
                data: data.data.series[0].data,
                tooltip: {
                  valueSuffix: ' 万m³'
                },
                maxPointWidth: 40,
                dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.2f}', // :.1f 为保留 1 位小数
                  y: 10
                },
                color: '#1890ff'
              }
            ],
          };
          break;
        default:
          break;
      }
      this.isVisibleVolumeStatistical = true;
      this.chartDataVolume = obj;

    });
   }
  // 获取施工船图表数据（本月）
  getDataByShipList() {
    this.isLoadingTwo = true;
    const options: any = {
      origin:environmentVolum.Origin,
      api: this.api_list_ship,
      params: {
        queryTime: format(this.showDay, 'YYYY-MM-DD')
      }
    }
    if (this.ProjectId1!=null) {
      options.params.projectId = this.ProjectId1;
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.isLoadingTwo = false;
      const series = [];
      let seriesList = [];
      if (data.data.barChartData.series.length){
        data.data.barChartData.series.forEach(element => {
          series.push([element.name, element.data[0]])
        });
      }
      if (series.length){
        seriesList = [
          {
            name: '日产量（' + format(this.showDay, 'YYYY-MM-DD') + '）',
            type: 'column',
            data: series,
            maxPointWidth: 40,
            color: '#1890ff',
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#000',
              align: 'right',
              format: '{point.y:.1f}', // :.1f 为保留 1 位小数
              y: 10
            },
            tooltip: {
              valueSuffix: ' m³'
            },
          }
        ]
      }else{
        seriesList = [];
      }
      const obj = {
        title: {
          text: ''
        },
        zoomType: 'xy',
        yAxisText: '产量（m³）',
        xAxis: {
          type: 'category',
          labels: {
            // rotation: -45  // 设置轴标签旋转角度
          }
        },
        yAxis: [{ // Primary yAxis
          labels: {
            format: '{value}',
            style: {
              color: '#1c2b36'
            }
          },
          title: {
            text: '产量（m³）',
            style: {
              color: '#1c2b36'
            }
          }
        }],
        tooltip: {
          shared: true
        },
        seriesList,
      };
      this.chartDataShip = obj;
    });
  }
  // 关键词搜索
  searchByKeyword(system) {
      const options = {
        api: system.api,
        origin: system.origin,
        params: {
          Name: system.searchKeyword
        }
      };
      this.server.getRxjsData(options).subscribe(res => {
        system.list = res.pageResult.data;
      });
  }

  // getHidList
  getHidList() {
    // 获取安全隐患系统检查单列表
    const options = {
      origin: environment.APIHdi,
      api: '/api/External/GetSecureInfoOfProject',
      params: {
        projNo: this.projectInfo.code || 'P282',
        checkType: 'JC',
        page: 1,
        rows: 1000
      }
    };
    this.server.getRxjsData(options).subscribe(data => {
      this.hdi.list = data.data;
    });
  }
  // 显示隐患详情
  showModaliframe(inspId){
    const src = environment.APIHdiIframeOrigin
    + '/assets/tpl/checkListPage/checkListItem.html?inspId=' + inspId + '&isOrigin=2';
    window.open(src, '_blank', 'scrollbars=yes,resizable=1,alwaysRaised=yes');
  }
}

