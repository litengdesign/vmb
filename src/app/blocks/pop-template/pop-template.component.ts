import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { differenceInCalendarDays, setHours, setDay, addDays, format,startOfMonth, endOfMonth,differenceInDays } from 'date-fns';
import { ServersService } from '../../servers.service';
import { MapService } from '../../services/map.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-pop-template',
  templateUrl: './pop-template.component.html',
  styleUrls: ['./pop-template.component.less']
})
export class PopTemplateComponent implements OnInit {
  @Input() popoverStyle: any; 
  @Input() showPop: any;
  @Input() point: any;
  @Output('closePop') closePopFtn = new EventEmitter<any>();
  public api_alert = "/api/AlertManage/GetAlertLogList";
  timeDefaultValue = setHours(new Date(), 0);
  public popData:any = {}
  public selectedIndex = 1;
  public colData:any = {};
  public title = '';//列表标题 
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  public TidalMonth = format(startOfMonth(new Date()), 'YYYY-MM');
  defaultSelectDate = [
    // format(addDays(new Date(), -30), 'YYYY-MM-DD'),
    // format(new Date(), 'YYYY-MM-DD')
  ];
  public deviceOption = {
    Page :1,
    Rows :10,
    total : 0,
    widthConfig:['45px', '80px', '130px', '150px', '100px', '50px', '50px', '50px', '50px', '50px', '50px', '100px'],
    defaultSelectDate:[
      // format(addDays(new Date(), -30), 'YYYY-MM-DD'),
      // format(new Date(), 'YYYY-MM-DD')
    ],
    loading :false,
    isLoading : false,
    charts:[
      {
        deviceTypeId: '1',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/SurfacePositionMonitor/GetChartDataX',
        }
      }, {
        deviceTypeId: '1',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/SurfacePositionMonitor/GetChartDataY'
        }
      },
      {
        deviceTypeId: '1',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/SurfacePositionMonitor/GetChartDataH',
        }
      }, {
        deviceTypeId: '1',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/SurfacePositionMonitor/GetChartDataPosition'
        }
      },
      {
        deviceTypeId: '2',
        options:{
          origin: environment.APIAutoDeform,
          api:'/api/DeepPosition/GetChartChangeDay',
        }
      },{
        deviceTypeId:'2',
        options:{
          origin: environment.APIAutoDeform,
          api:'/api/DeepPosition/GetChartChangeDeflection'
        }
      },
      {
        deviceTypeId: '3',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/StratifiedSettlementMonitor/GetSubsideChartChangeDay',
        }
      }, 
      {
        deviceTypeId: '3',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/StratifiedSettlementMonitor/GetSubsideChartChangeDeflection'
        }
      },
      {
        deviceTypeId: '4',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/WaterPressureMonitor/GetWaterPressureChartChangeDay',
        }
      },
      {
        deviceTypeId: '4',
        options: {
          origin: environment.APIAutoDeform,
          api: '/api/WaterPressureMonitor/GetWaterPressureChartChangeDeflection'
        }
      }
    ]
  }
  public alertOption = {
    Page: 1,
    Rows: 5,
    total: 0,
    widthConfig: ['50px', '100px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '100px'],
    defaultSelectDate: [
      format(addDays(new Date(), -30), 'YYYY-MM-DD'),
      format(new Date(), 'YYYY-MM-DD')
    ],
    loading: false,
    isLoading: false
  }
  public tidelOption = {
    origin: environment.APITidal,
    list:[
      {
        name:'潮位数据预处理成果列表',
        options:{
          api: '/api/TidalStationResult/GetListPreprocessResult',
        }
      },
      {
        name: '潮位数据特征值列表',
        options:{
          api: '/api/TidalStationResult/GetListTidalCharacteristic',

        },
        nzScroll:{ x: '3610px' }
      },
      {
        name: '高低潮统计成果列表',
        options:{
          api: '/api/TidalStationResult/GetListTidalHlDaily',

        }
      },
      {
        name: '预报潮位数据列表',
        options:{
          api: '/api/TidalStationResult/GetListTidalForcast',

        }
      },
      {
        name: '潮位高低潮预报成果列表',
        options:{
          api: '/api/TidalStationResult/GetListForcastHighLowTide',

        },
      },
      {
        name: '非调和常数列表',
        options:{
          api: '/api/TidalStationResult/GetListNonharmonicConst',
        },
        nzScroll: { x: '2350px' }
      },
      {
        name: '潮位差比关系信息列表',
        options:{
          api: '/api/TidalStationResult/GetListDifferRatio',
        },
        nzScroll: { x: '1200px' }
      },
      {
        name: '潮位月报表',
        options:{
          api: '/api/TidalMonthReport/GetListTidalMonthReport',
        },
        nzScroll: { x: '1200px' }
      },
      
    ]
  }
  public selectedTidal:any = {
    total:0,
    params: {
      Sidx: 'id',
      Page: 1,
      Rows: 10,
      TidalStationId: '',
      StartTime: '',
      EndTime: ''
    }
  }
  //北向位移变化曲线图
  public chartNorth: any = {
    name: 'chartNorth',
    title: '北向位移变化曲线图',
    api: '/api/SurfacePositionMonitor/GetChartDataX',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '244',
    cardGridStyle: {
      width: '100%',
      height: '370px'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      labels: {
        rotation: 0,
        style: {
          font: '12px'
        },
      }
    },
    yAxis: {
      title: {
        text: '位移(mm)'
      },
      labels: {
        formatter: function () {
          return Math.floor(this.value * 100) / 100
        }
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormatter: function () {
        return "<tr><td>测量时间: <b>" + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + "</b></tr><tr><td>" + this.series.name + ': <b>' + Math.floor(this.y * 100) / 100 + 'mm</b></td>'
      },
      footerFormat: "<table>",
    },
    seriesName: '北向位移', //X轴显示名称
    legend: {
      enabled: false
    },
    yAxisText: '位移(mm)',
  }
  //东向位移变化曲线图
  public chartEast: any = {
    name: 'chartEast',
    title: '东向位移变化曲线图',
    api: '/api/SurfacePositionMonitor/GetChartDataY',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '244',
    cardGridStyle: {
      width: '100%',
      height: '370px'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 0,
        style: {
          font: '12px'
        },
      }
    },
    yAxis: {
      title: {
        text: '位移(mm)'
      },
      labels: {
        formatter: function () {
          return Math.floor(this.value * 100) / 100
        }
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormatter: function () {
        return "<tr><td>测量时间: <b>" + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + "</b></tr><tr><td>" + this.series.name + ': <b>' + Math.floor(this.y * 100) / 100 + 'mm</b></td>'
      },
      footerFormat: "<table>",
    },
    legend: {
      enabled: false
    },
    seriesName: '东向位移', //X轴显示名称
    yAxisText: '位移(mm)',
  }
  //高程位移变化曲线图
  public chartHeight: any = {
    name: 'chartHeight',
    title: '高程变化曲线图',
    api: '/api/SurfacePositionMonitor/GetChartDataH',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '244',
    cardGridStyle: {
      width: '100%',
      height: '370px'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 0,
        style: {
          font: '12px'
        },
      }
    },
    yAxis: {
      title: {
        text: '位移(mm)'
      },
      labels: {
        formatter: function () {
          return Math.floor(this.value * 100) / 100
        }
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormatter: function () {
        return "<tr><td>测量时间: <b>" + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + "</b></tr><tr><td>" + this.series.name + ': <b>' + Math.floor(this.y * 100) / 100 + 'mm</b></td>'
      },
      footerFormat: "<table>",
    },
    legend: {
      enabled: false
    },
    seriesName: '高程变化', //X轴显示名称
    seriesList: [], //x轴数据
    yAxisText: '位移(m)',
  }
  //平面位移矢量图
  public chartPoint: any = {
    name: 'chartPoint',
    title: '平面位移矢量图',
    api: '/api/SurfacePositionMonitor/GetChartDataPosition',
    color: 'rgb(205,205,205)',
    chartType: 'line', //图形类型
    height: '244',
    cardGridStyle: {
      width: '100%',
      height: '370px'
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        format: '{value:.,0f}',
      },
      allowDecimals: true,
      lineWidth: 1
    },
    xAxis: {
      reversed: false,
      title: {
        text: ''
      },
      labels: {
        rotation: 30,
        format: '{value:.,0f}',
        x: -20,
      },
      allowDecimals: true,
      showLastLabel: true,
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<b>坐标</b><table>",
      pointFormat: '<tr><td><b>{point.x}, {point.y}</b></td></tr>',
      footerFormat: '</table>',
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      enabled: true
    },
  }
  //深层位移(单次)
  public singleDeepPosition: any = {
    name: 'singleDeepPosition',
    title: '单次变化量曲线图',
    api: '/api/DeepPosition/GetChartChangeDay',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    xAxis: {
      title: {
        text: '测点高程(m)'
      },
      labels: {
        rotation: 0,
        style: {
          font: '12px'
        }
      },
      reversed: false
    },
    legend: {
      title: {
        text: ''
      },
      width: 200,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemWidth: 180
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormatter: function () {
        return '<tr><td><b>测量时间: </b>' + this.series.name + '</tr><tr><td><b>测点高程：</b>' + Math.floor(this.x * 100) / 100 + ' m</td></tr><tr><td><b>位移量：</b>' + Math.floor(this.y * 100) / 100 + ' mm</td></tr>'
      },
      footerFormat: '</table>'
    },
    yAxisText: '位移(mm)',
    seriesList: [] //x轴数据
  }
  //累计
  public manyDeepPosition: any = {
    name: 'manyDeepPosition',
    title: '累计变化量曲线图',
    api: '/api/DeepPosition/GetChartChangeDeflection',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    xAxis: {
      title: {
        text: '测点高程(m)'
      },
      labels: {
        rotation: 0,
        style: {
          font: '12px'
        }
      },
      reversed: false
    },
    legend: {
      title: {
        text: ''
      },
      width: 200,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemWidth: 180
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormatter: function () {
        return '<tr><td><b>测量时间: </b>' + this.series.name + '</tr><tr><td><b>测点高程：</b>' + Math.floor(this.x * 100) / 100 + ' m</td></tr><tr><td><b>位移量：</b>' + Math.floor(this.y * 100) / 100 + ' mm</td></tr>'
      },
      footerFormat: '</table>'
    },
    yAxisText: '位移(mm)',
    seriesList: [] //x轴数据
  }
  //孔隙水压力
  public singleOptionlayered: any = {
    name: 'singleOptionlayered',
    title: '单次变化量曲线图',
    api: '/api/WaterPressureMonitor/GetWaterPressureChartChangeDay',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 30,
        style: {
          font: '12px'
        },
      },

    },
    tooltip: {
      useHTML: true,
      valueDecimals: 3,
      headerFormat: '<table>',
      pointFormatter: function () {
        return '<tr><td>测量时间: <b>' + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + '</b></tr><tr><td><b>内测点名称：</b>' + this.series.name + '</td></tr><tr><td><b>水压力值：</b>' + Math.floor(this.y * 100) / 100 + ' kPa</td></tr></table>'
      },
      footerFormat: '</table>'
    },
    legend: {
      title: {
        text: '内测点'
      },
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    yAxisText: '孔隙水压力KPa',
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }
  //累计
  public manyOptionlayered: any = {
    name: 'manyOptionlayered',
    title: '累计变化量曲线图',
    api: 'WaterPressureMonitor/GetWaterPressureChartChangeDeflection',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    tooltip: {
      useHTML: true,
      valueDecimals: 3,
      headerFormat: '<table>',
      pointFormatter: function () {
        return '<tr><td>测量时间: <b>' + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + '</b></tr><tr><td><b>内测点名称：</b>' + this.series.name + '</td></tr><tr><td><b>水压力值：</b>' + Math.floor(this.y * 100) / 100 + ' kPa</td></tr></table>'
      },
      footerFormat: '</table>'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 30,
        style: {
          font: '12px'
        },
      }
    },
    legend: {
      title: {
        text: '内测点'
      },
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    yAxisText: '孔隙水压力KPa',
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }
  //分层沉降监测
  public singleSubsideChartChange: any = {
    name: 'singleSubsideChartChange',
    title: '单次变化量曲线图',
    api: 'StratifiedSettlementMonitor/GetSubsideChartChangeDay',
    color: '#61B2F0',
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    tooltip: {
      useHTML: true,
      valueDecimals: 3,
      headerFormat: '<table>',
      pointFormatter: function () {
        return '<tr><td>测量时间: <b>' + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + '</b></tr><tr><td><b>内测点名称：</b>' + this.series.name + '</td></tr><tr><td><b>位移量：</b>' + Math.floor(this.y * 100) / 100 + ' mm</td></tr></table>'
      },
      footerFormat: '</table>'

    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 30,
        style: {
          font: '12px'
        },
      }
    },
    legend: {
      title: {
        text: '内测点'
      },
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    yAxisText: '沉降量(mm)',//y轴标题
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }
  //累计
  public manySubsideChartChange: any = {
    name: 'manySubsideChartChange',
    title: '累计变化量曲线图',
    api: 'StratifiedSettlementMonitor/GetSubsideChartChangeDeflection',
    color: '#61B2F0',
    yTitle: '位移',   //y轴标题
    chartType: 'spline', //图形类型
    height: '380',
    cardGridStyle: {
      width: '100%',
      height: '668px'
    },
    tooltip: {
      useHTML: true,
      valueDecimals: 3,
      headerFormat: '<table>',
      pointFormatter: function () {
        return '<tr><td>测量时间: <b>' + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + '</b></tr><tr><td><b>内测点名称：</b>' + this.series.name + '</td></tr><tr><td><b>位移量：</b>' + Math.floor(this.y * 100) / 100 + ' mm</td></tr></table>'
      },
      footerFormat: '</table>'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      },
      tickPixelInterval: 100,
      labels: {
        rotation: 30,
        style: {
          font: '12px'
        },
      }
    },
    legend: {
      title: {
        text: '内测点'
      },
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    yAxisText: '累计沉降量(mm)',
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }
  //历史潮位
  public historyTidalChart:any = 
    {
      name: 'historyTidal',
      title: '历史潮位曲线图',
      api: '/api/TidalStationInfo/GetHistoryTidalChartData',
      height: '244',
      cardGridStyle: {
        width: '100%',
        height: '370px'
      },
      zoomType: 'xy',
      yAxisText: '潮高（m）',
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%m-%d',
          week: '%m-%d',
          month: '%Y-%m',
          year: '%Y'
        },
        tickPixelInterval: 100,
        labels: {
          rotation: 0,
          style: {
            font: '12px'
          },
        }
      },
      tooltip: {
        useHTML: true,
        valueDecimals: 3,
        headerFormat: '<table>',
        pointFormatter: function () {
          return '<tr><td>测量时间: <b>' + format(new Date(this.x), 'YYYY-MM-DD HH:mm:ss') + '</b></tr><tr><td><b>潮位站名称：</b>' + this.series.name + '</td></tr><tr><td><b>潮高：</b>' + Math.floor(this.y * 100) / 100 + ' m</td></tr></table>'
        },
        footerFormat: '</table>'
      }
  }
  public searchData: any; //图表外层搜索条件值
  constructor(public server: ServersService, public mapServer: MapService) {
    this.mapServer.popoverStyle.subscribe(res=>{
      this.popoverStyle = res;
    })
    this.mapServer.selectedPoint.subscribe(res => {
      this.point = res;
      this.getDetail();
    })
  }
  ngOnInit() {
    this.selectedIndex = 0;
    this.selectedTidal.name = this.tidelOption.list[0].name;
    this.selectedTidal.options = this.tidelOption.list[0].options;
    this.selectedTidal.nzScroll = this.tidelOption.list[0].nzScroll;
    this.selectedTidal.defaultSelectDate = [
      // format(addDays(new Date(), -30), 'YYYY-MM-DD'),
      // format(new Date(), 'YYYY-MM-DD')
    ]
  }
  //判断组件绑定值变化
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['popoverStyle'] && changes['popoverStyle'].currentValue) || changes['showPop'] && changes['showPop'].currentValue) {
      this.popoverStyle = changes['popoverStyle'] ? changes['popoverStyle'].currentValue : this.popoverStyle;
    }
    // if (changes['point'] && changes['point'].currentValue && this.showPop) {
      
    // }
  }
  closePop(){
    this.showPop  =false;
    this.closePopFtn.emit();
    this.mapServer.showPop.next(false)
  }
  //获取变形监测点详情
  getDetail(){
    this.selectedIndex = 0;
    this.deviceOption.isLoading = true;
    this.server.getRxjsData(this.point.options).subscribe(data=>{
      this.deviceOption.isLoading = false;
      this.popData = data.data || data ;
    })
  }
  //获取变形监测测点数据列表
  getDevicesList(reset: boolean = false){
    this.deviceOption.Page = reset ? 1 : this.deviceOption.Page;
    let api;
    switch (this.popData.deviceTypeId) {
      case 1:
        api = "/api/SurfacePositionMonitor/GetDataList"
        break;
      case 2:
        api = "/api/DeepPosition/GetDeepAllDataList"
        break;
      case 3:
        api = "/api/StratifiedSettlementMonitor/GetSubsideAllDataList"
        break;
      case 4:
        api = "/api/WaterPressureMonitor/GetWaterPressureAllDataList"
        break;
      default:
        break;
    }
    let options = {
      origin: this.point.options.origin,
      api: api,
      params: {
        Sidx: '0',
        Rows: this.deviceOption.Rows,
        Page: this.deviceOption.Page,
        DataType: this.popData.deviceTypeId,
        Id: this.popData.deviceId,
        StartTime: format(this.deviceOption.defaultSelectDate[0],'YYYY-MM-DD'),
        EndTime: format(this.deviceOption.defaultSelectDate[1], 'YYYY-MM-DD'),
      }
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.popData.displayData = data.data;
      this.deviceOption.total = data.total;
    })
  }

  //获取变形监测报警信息列表
  getAlert(reset: boolean = false){

      let options = {
        origin: this.point.options.origin,
        api: this.api_alert,
        params: {
          Sidx: '0',
          Rows: this.alertOption.Rows,
          Page: this.alertOption.Page,
          Id: this.popData.deviceId,
          StartTime: format(this.alertOption.defaultSelectDate[0], 'YYYY-MM-DD'),
          EndTime: format(this.alertOption.defaultSelectDate[1], 'YYYY-MM-DD'),
        }
      }
      this.server.getRxjsData(options).subscribe((data) => {
        this.popData.displayAlertData = data.data;
        this.alertOption.total = data.total;
      })
    
  }
  //获取潮位站成果
  getTidelList(reset: boolean = false,item?){
    this.selectedTidal.options = item ? item.options : this.selectedTidal.options;
    this.selectedTidal.name = item ? item.name : this.selectedTidal.name;
    this.selectedTidal.nzScroll = item ? item.nzScroll : this.selectedTidal.nzScroll;
    let options = this.selectedTidal.options;
    options.origin = this.tidelOption.origin;
    options.params = this.selectedTidal.params;
    options.params.TidalStationId = this.point.options.params.id;
    options.params.StartTime = format(this.selectedTidal.defaultSelectDate[0], 'YYYY-MM-DD');
    options.params.EndTime = format(this.selectedTidal.defaultSelectDate[1], 'YYYY-MM-DD');
    if (this.TidalMonth) {
      options.params.StartDateTime = format(startOfMonth(this.TidalMonth), 'YYYY-MM-DD');
      options.params.EndDateTime = format(endOfMonth(this.TidalMonth), 'YYYY-MM-DD');
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.popData.displayTidalData = data.data || [];
      this.selectedTidal.total = data.total
      if(this.selectedTidal.name=='潮位月报表'){
        this.colData = data.data || [];
        this.popData.displayTidalData = this.colData.dataTable?[...this.colData.dataTable]:[];
        let StartDateTime = format(startOfMonth(this.TidalMonth), 'YYYY-MM-DD');
        let EndDateTime = format(endOfMonth(this.TidalMonth), 'YYYY-MM-DD');
        let sumDay = differenceInDays(EndDateTime,StartDateTime)+1;
        this.popData.displayTidalData.forEach((element) => {
          element.day_high_height = element.day_high_height ? element.day_high_height.split(','):'';
          element.day_low_height = element.day_low_height ? element.day_low_height.split(','):'';
        })
        let list = [];
        for (var i = 0; i < sumDay;i++){
          let obj:any = {};
          obj.monthdate = format(addDays(StartDateTime, i),'YYYY-MM-DD');
          this.popData.displayTidalData.forEach((element)=>{
            if (element.monthdate == obj.monthdate){
              obj = element;
            }
          })
          list.push(obj);
        }
        this.popData.displayTidalData = list
        this.title = this.selectedTidal.name + format(this.TidalMonth, 'YYYY') + "年" + format(this.TidalMonth, 'MM') + "月份潮水位观测月报表";
      }
    })
  }

  //请求变形监测图示
  getChart(){
    this.searchData = {
      systemId:this.point.systemId,
      origin: this.point.options.origin,
      id: this.point.options.params.id,
      rangeDate: this.defaultSelectDate
    }
  }
}
