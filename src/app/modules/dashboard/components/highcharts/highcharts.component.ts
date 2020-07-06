import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter, } from '@angular/core';
import * as Highcharts from 'highcharts'; // highcharts图表
@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.less']
})
export class HighchartsComponent implements OnChanges, OnInit {
  @Input() chartsObj: any; // 接收父组件传递的图表配置参数
  public _Charts: any = ''; // 接收chart
  public _ChartsModel: any = ''; // model chart
  public devicesId: any; // router值
  public selectedDevicesId: any = ''; // router不包函deviceid
  public deviceTypeId: any;
  public seriesList: any;
  public isVisible = false;

  @ViewChild('chartElement', { static: false}) public chartElement: ElementRef; // 接收dom
  constructor() { }

  ngOnInit() { }
  // 判断组件绑定值变化
  ngOnChanges(changes: SimpleChanges) {
    this.createChart();
  }
  // 绘制hcharts
  createChart() {
    // 图表参数
    let chartOption:any = {
      chart: {

        backgroundColor: 'transparent',
        zoomType: this.chartsObj.zoomType || null,
        type: this.chartsObj.chartType || null, // 绘制类型
        renderTo: this.chartElement?this.chartElement.nativeElement:'', // 挂载元素
        inverted: false, // 是否显示数据点
      },
      title: {
        text: ""
      },
      lang: {
        noData: "赞无数据" // 真正显示的文本
      },
      noData: {
        // Custom positioning/aligning options
        position: {
          align: 'right',
          verticalAlign: 'bottom'
        },
        // Custom svg attributes
        attr: {
          'stroke-width': 1,
          stroke: '#cccccc'
        },
        // Custom css
        style: {
          fontWeight: 'bold',     
          fontSize: '15px',
          color: '#202030'        
        }
      },
      xAxis: this.chartsObj.xAxis || {
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
      yAxis: this.chartsObj.yAxis || {
        title: {
          text: this.chartsObj.yAxisText
        },
      },
      tooltip: this.chartsObj.tooltip || {},
      legend: this.chartsObj.legend || {},
      series: this.chartsObj.seriesList,
      responsive: this.chartsObj.responsive || {}
    }
    if ((this._Charts != '' && this._Charts.index > -1) && !this.isVisible) {
      this._Charts.destroy();
      this._Charts = '';
    }
    if (this.chartsObj.seriesList && this.chartsObj.seriesList.length) {
      this._Charts = new Highcharts.Chart(chartOption);
    }
  }
}
