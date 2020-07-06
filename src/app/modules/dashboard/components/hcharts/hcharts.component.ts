
import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts' //highcharts图表
import { ComomService } from '../../../../shared/servers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { differenceInCalendarDays, setHours, setDay, addDays, format } from 'date-fns';
import { style } from '@angular/animations';
const projects = [];
const devices = {};
@Component({
  selector: 'app-hcharts',
  templateUrl: './hcharts.component.html',
  styleUrls: ['./hcharts.component.less'],
})
export class HchartsComponent implements OnChanges, OnInit {
  @Input() chartsObj: any; //接收父组件传递的图表配置参数
  @Input() searchData: any;//接收父组件的搜索值
  @Input() chartHeight: any;//接收父组件的chart元素高度值
  public _Charts: any = ''; //接收chart
  public _ChartsModel: any = ''; //model chart
  public devicesId: any; //router值
  public selectedDevicesId: any = ''; //router不包函deviceid
  public deviceTypeId: any;
  public seriesList: any;
  public StartTime: any = addDays(new Date(), -30);
  public EndTime: any = new Date();
  public today = new Date();
  public isLoading: boolean = false;
  public isVisible = false;
  public defaultDate: any; //日期区间默认值
  public selectDevicedNormal: any; //model 测点接收值
  public defaultDateNormal: any; //model 时间区间接收值
  public isSpinning = false;
  //时间组件
  timeDefaultValue = setHours(new Date(), 0);
  public datepicker:any = [this.StartTime,this.EndTime];
  //测点组件
  public device: any[] = null;
  public deviceName: any;
  //存储搜索结果
  public List: any;
  //外层搜索
  @ViewChild('chartElement',{static:false}) public chartElement: ElementRef; //接收dom
  @ViewChild('chartDate', { static: false }) public chartDateEl: any;
  @ViewChild('selectedDevicesId', { static: false }) public devicesIdEl: any;
  //model搜索
  @ViewChild('chartElementModel', { static: false }) public chartElementModelEl: any;
  @ViewChild('modelChartDate', { static: false }) public modelChartDateEl: any;
  @ViewChild('modelDevicesId', { static: false }) public modelDevicesIdEl: any;
  @ViewChild('modelContent',{static:false}) public modelContentEl: any;

  constructor(private router: ActivatedRoute, public server: ComomService, private http: HttpClient) { }
  ngOnInit() {}
  //判断组件绑定值变化
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchData'] && changes['searchData'].currentValue) {
      this.selectedDevicesId = changes['searchData'].currentValue.id; //测点id
      //时间
      var currentDate = changes['searchData'].currentValue.rangeDate;
      if(currentDate.length){
        this.StartTime = currentDate[0];
        this.EndTime = currentDate[1];
        this.datepicker = [currentDate[0], currentDate[1]]
        this.getChartData();
      }
    }
  }
  //获取图表数据
  getChartData() {
    let options:any = {};
    options = {
      origin: this.searchData.origin,
      api: this.chartsObj.api,
    }
    if (this.searchData.systemId == 'ADS') {
      options.params = {
        StartTime: this.StartTime,
        EndTime: this.EndTime ,
        Id: this.selectedDevicesId
      }
    } else if (this.searchData.systemId == 'Tidal') {
      options.params = {
        starttime: format(this.datepicker[0], 'yyyy-MM-dd'),
        endtime:format(this.datepicker[1], 'yyyy-MM-dd') ,
        StationIds: [this.selectedDevicesId]
      }
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.List = [];
      //北向位移
      if (this.chartsObj.name == 'chartNorth') {
        this.List = data.valueX;
        this.seriesList = [
          {
            name: this.chartsObj.seriesName,
            data: this.List,
          }
        ]
      } else if (this.chartsObj.name == 'chartEast') {
        this.List = data.valueY;
        this.seriesList = [
          {
            name: this.chartsObj.seriesName,
            color: this.chartsObj.color,
            data: this.List,
          }
        ]
      } else if (this.chartsObj.name == 'chartHeight') {
        this.List = data.valueH
        this.seriesList = [
          {
            name: this.chartsObj.seriesName,
            color: this.chartsObj.color,
            data: this.List,
          }
        ]
      } else if (this.chartsObj.name == 'chartPoint') {
        data.position.forEach((item, index) => {
          const obj = {
            x: parseFloat(item[0]),
            y: parseFloat(item[1]),
            marker: {
              symbol: 'url(../../assets/images/arrow.svg)',
            },
          }
          if (index == 0) {
            delete obj.marker;
          }
          this.List.push(obj);
        })
        this.seriesList = [{
          name: '开始点',
          color: 'rgb(26,250,41)',
          data: [{
            x: this.List.length > 0 ? this.List[0].x : '',
            y: this.List.length > 0 ? this.List[0].y : '',
            marker: {
              symbol: 'url(../../assets/images/startPoint.svg)'
            }
          }]
        },
        {
          name: '历史点',
          color: this.chartsObj.color,
          data: this.List
        },
        {
          name: '结束点',
          color: 'rgb(238,96,13)',
          data: [{
            x: this.List.length > 0 ? this.List[this.List.length - 1].x : '',
            y: this.List.length > 0 ? this.List[this.List.length - 1].y : '',
            marker: {
              symbol: 'url(../dev/assets/images/endPoint.svg)'
            }
          }]
        }]
      }
      //深层位移
      else if (this.chartsObj.name == 'singleDeepPosition') {
        data.forEach((item, index) => {
          this.List.push(item.dataDay)
        })
        this.seriesList = this.List;
      }
      else if (this.chartsObj.name == 'manyDeepPosition') {
        data.forEach((item, index) => {
          this.List.push(item.dataDeflection)
        })
        this.seriesList = this.List;
      }
      //孔隙水压力
      else if (this.chartsObj.name == 'singleOptionlayered') {
        data.forEach((item, index) => {
          this.List.push(item.dataDay)
        })
        this.seriesList = this.List;
      }
      else if (this.chartsObj.name == 'manyOptionlayered') {
        data.forEach((item, index) => {
          this.List.push(item.dataDeflection)
        })
        this.seriesList = this.List;
      }
      //分层沉降监测
      else if (this.chartsObj.name == 'singleSubsideChartChange') {
        data.forEach((item, index) => {
          this.List.push(item.dataDay)
        })
        this.seriesList = this.List;
      }
      else if (this.chartsObj.name == 'manySubsideChartChange') {
        data.forEach((item, index) => {
          this.List.push(item.dataDeflection)
        })
        this.seriesList = this.List;
      }
      else if (this.chartsObj.name == 'historyTidal') {
        data.data.forEach(element => {
          this.List.push(element[0].dataDay)
        });
        this.seriesList = this.List;
      }
      //如果存在数据则渲染
      if (this.List.length > 0) {
        this.createChart();
      } else {
        this.isSpinning = false;
        if (this.isVisible) {
          if (this._ChartsModel != '' && this._ChartsModel.index > -1) {
            this._ChartsModel.destroy();
            this._ChartsModel = '';
          }
        } else {
          if (this._Charts != '' && this._Charts.index > -1) {
            this._Charts.destroy();
            this._Charts = '';
          }
        }
      }
    });
  }
  //绘制hcharts
  createChart() {
    let element: any;
    //判断挂载元素
    if (this.isVisible) {
      element = this.chartElementModelEl;
    } else {
      element = this.chartElement;
    }
    //图表参数
    let chartOption = {
      chart: {
        backgroundColor:'transparent',
        marginLeft: this.isVisible?80:60,
        marginRight: this.isVisible ? 60 : 10,
        type: this.chartsObj.chartType, //绘制类型
        renderTo: element.nativeElement, //挂载元素
        inverted: (this.chartsObj.name == 'singleDeepPosition' || this.chartsObj.name == 'manyDeepPosition') ? true : false, //是否显示数据点
        height: this.isVisible ? '540' : this.chartsObj.height,
        width: this.isVisible ? '1150' : this.chartsObj.width,
      },
      title: {
        text: ""
      },
      xAxis: this.chartsObj.xAxis || {},
      yAxis: {
        title: {
          text: this.chartsObj.yAxisText,
          style:{
            color:'#fff'
          }
        },
        labels: {
          style: {
            font: '12px',
            color:'#fff'
          },
        }
      },
      tooltip: this.chartsObj.tooltip || {},
      legend: this.chartsObj.legend || {
        itemStyle: {
          color: '#fff',
          fontWeight: 'bold'
        }
      },
      series: this.seriesList,
      responsive: this.chartsObj.responsive || {}
    }
    if (this.isVisible) {
      if ((this._ChartsModel != '' && this._ChartsModel.index > -1) && !this.isVisible) {
        this._ChartsModel.destroy();
      }
      this._ChartsModel = new Highcharts.Chart(chartOption);
    } else {
      if ((this._Charts != '' && this._Charts.index > -1) && !this.isVisible) {
        this._Charts.destroy();
      }
      this._Charts = new Highcharts.Chart(chartOption);
      this.isSpinning = false;
    }

  }
  //查询方法
  searchChartData() {
    this.isSpinning = true;
    this.isLoading = true;
    this.StartTime = format(this.datepicker[0], 'yyyy-MM-dd');
    this.EndTime = format(this.datepicker[1], 'yyyy-MM-dd');

    if (this.StartTime && this.selectedDevicesId) {
      this.getChartData();
    }
    setTimeout(_ => {
      this.isLoading = false;
    }, 1000);
  }
  //model查询方法
  modelSearchChartData() {
    if (this.modelChartDateEl.defaultSelectDate.length) {
      this.StartTime = format(this.modelChartDateEl.defaultSelectDate[0], 'yyyy-MM-dd');
      this.EndTime = format(this.modelChartDateEl.defaultSelectDate[1], 'yyyy-MM-dd');
    } else {
      this.StartTime = '';
      this.EndTime = '';
    }
    if (this.modelDevicesIdEl) {
      this.selectedDevicesId = this.modelDevicesIdEl.values.length ? this.modelDevicesIdEl.values[1] : this.selectedDevicesId; //测点id
    }
    if (this.StartTime && this.selectedDevicesId) {
      this.getChartData();
    } else {
      if (this._ChartsModel != '' && this._ChartsModel.index > -1) {
        this._ChartsModel.destroy();
        this._ChartsModel = '';
      }
    }
    this.isLoading = false;
  }
  showModal(): void {
    this.isVisible = true;
    //验证数据是否存在
    if (!this.List.length) {
      if (this._ChartsModel != '') {
        this._ChartsModel.destroy();
        this._ChartsModel = '';
      }
      return;
    } else {
      this.createChart();
    }
  }
  handleCancel(): void {
    this.isVisible = false;
    //验证数据是否存在
    if (!this.seriesList[0].data.length) {
      return;
    } else {
      this.createChart();
    }
  }
  //时间控制
  range(start: number, end: number): number[] {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledRangeTime = (value: Date[], type: 'start' | 'end'): object => {
    if (type === 'start') {
      return {
        nzDisabledHours: () => this.range(0, 60).splice(4, 20),
        nzDisabledMinutes: () => this.range(30, 60),
        nzDisabledSeconds: () => [55, 56]
      };
    }
    return {
      nzDisabledHours: () => this.range(0, 60).splice(20, 4),
      nzDisabledMinutes: () => this.range(0, 31),
      nzDisabledSeconds: () => [55, 56]
    };
  };
  //测点选择组件
  getProject() {
    this.device = [];
    //请求工程信息
    const option = {
      api: "Map/GetAllProjectsPositionInfo",
      params: {

      }
    }
    let rxjsData = this.server.getRxjsData(option);
    rxjsData.subscribe((data) => {
      projects.length = 0;
      data.projects.forEach(element => {
        // this.getDevicesPositionInfo(element.id);
        var obj: any = {
          value: element.id,
          label: element.name,
          id: element.id
        }
        projects.push(obj)
      });
    })
  }
  //获取子列表
  getDevicesPositionInfo(devicesId) {
    const params = {
      api: "Map/GetDevicesPositionInfo",
      params: {
        id: devicesId
      }
    }
    this.server.getRxjsData(params).subscribe((data) => {
      var arr = [];
      if (this.deviceTypeId) {
        data.devices.forEach(element => {
          var obj: any = {
            value: element.id,
            label: element.name,
            isLeaf: true
          }
          if (element.deviceTypeId == this.deviceTypeId) {
            arr.push(obj)
          }
        });
        if (arr.length == 0) {
          arr.push(
            {
              value: null,
              label: '暂无数据',
              isLeaf: true,
              disabled: true,
            }
          )
        }
      } else {
        data.devices.forEach(element => {
          var obj: any = {
            value: element.id,
            label: element.name,
            isLeaf: true
          }
          arr.push(obj)
        });
      }

      devices[devicesId] = arr;
    })

  }
  loadData(node, index) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (index < 0) { // if index less than 0 it is root node
          node.children = projects;
        } else if (index === 0) {
          node.children = devices[node.value];
        }
        resolve();
      }, 500);
    });
  }
  //测点改变
  onChanges(values: any): void {
    // console.log(values);
    if (values.index == 0) {
      this.getDevicesPositionInfo(values.option.value)
    } else {
      this.selectedDevicesId = values.option.value;
      this.deviceName = values.option.label;
    }
  }
  //接收测点名称
  getDeviceName(event) {
    this.deviceName = event;
  }
}
