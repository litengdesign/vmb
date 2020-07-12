import { Component, OnInit } from '@angular/core';
import { addDays, format } from 'date-fns';
import { ComomService } from '../../../../shared/servers.service';
import { environmentVolum} from '../../../../../environments/environment';

@Component({
  selector: 'app-volume-board',
  templateUrl: './volume-board.component.html',
  styleUrls: ['./volume-board.component.less']
})
export class VolumeBoardComponent implements OnInit {

  chartOption = {
    color: ['#4BCDA7', '#FF625C'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      top: 28,
      data: [
        {
          name: '累计排入量',
          textStyle: {
            color: '#fff'
          }
        },
        {
          name: '累计排出量',
          textStyle: {
            color: '#fff'
          }
        }
      ],
      itemWidth: 5,
      itemHeight: 5,
      borderRadius: 5,
    },
    grid: {
      left: '6%',
      right: '4%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: {
          lineStyle: {
            color: '#ced2eb',
          }
        }
      }
    ],
    yAxis: [
      {
        name: '单位：万立方米',
        left: 10,
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ced2eb',
          }
        },
        splitNumber: 2,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
    ],
    series: [
      {
        name: '累计排入量',
        barWidth: '30%',
        type: 'bar',
        data: [55, 53, 47, 49, 52, 57, ]
      },
      {
        name: '累计排出量',
        type: 'bar',
        barWidth: '30%',
        data: [56, 59, 61, 54, 59, 58]
      },


    ]
  };
  public api_list = '/api/VolumeStatistics/GetVolumeDataByMonth'; // 按月获取图表数据
  public api_list_day = '/api/VolumeStatistics/GetVolumeDataByDay'; // 按天搜索图表数据
  public api_list_ship = '/api/VolumeStatistics/GetShipVolumeData'; // 按船搜索图表数据

  public chartData: any = {}; // 图表数据
  public chartDataShip: any = {}; // 施工船舶图表数据
  public listOfAllData: any[] = [];
  public projects = []; // 项目列表
  public ProjectId = null; // 项目1
  public ProjectId1 = null; // 项目2

  // 其他参数
  public defaultSelectDate: any = [addDays(new Date(), -365), new Date()];
  public shipId = null;
  public ships: any[] = [];
  public searchType = 'month'; // 默认搜索方式
  public showDay = format(new Date(), 'yyyy-MM-dd');
  public isLoadingOne = false;
  public isLoadingTwo = false;
  public nzFormat = 'yyyy/MM/dd';


  constructor(public comomServer: ComomService) {
    this.comomServer.selectedProject.subscribe(res => {
      if (res) {
        this.getDataList(res);
      }
    })
  }

  ngOnInit(): void {
    this.getDataList();
  }
  changeChartType(value) {
    this.searchType = value;
    this.getDataList();
  }
  // 获取图表数据(默认按月)
  getDataList(id?) {
    const params: any = {};
    if (id) {
      params.projectId = id;
    }
    switch (this.searchType) {
      case 'month':
        params.startTime = format(this.defaultSelectDate[0], 'YYYY-MM');
        params.endTime = format(this.defaultSelectDate[1], 'YYYY-MM');
        break;
      case 'day':
        params.startTime = format(this.defaultSelectDate[0], 'YYYY-MM-DD');
        params.endTime = format(this.defaultSelectDate[1], 'YYYY-MM-DD');
        break;
      default:
        break;
    }
    if (this.shipId != null) {
      params.shipId = this.shipId.shipId;
    }
    const options: any = {
      origin: environmentVolum.Origin,
      api: this.searchType === 'month' ? this.api_list : this.api_list_day,
      params
    };
    this.comomServer.getRxjsData(options).subscribe((data) => {
      this.isLoadingOne = false;
      let obj = {};
      switch (this.searchType) {
        case 'month':
          obj = {
            title: {
              text: '运砂量统计(月)',
              style: {
                color: '#fff'
              }
            },
            zoomType: 'xy',
            xAxis: [{
              categories: data.data.barChartData.xAxis,
              crosshair: true,
              labels: {
                style: {
                  color: '#E2F5FF'
                }
              },
            }],
            yAxisText: '产量（万m³）',
            yAxis: [{ // Primary yAxis
              labels: {
                format: '{value}',
                style: {
                  color: '#E2F5FF'
                }
              },
              title: {
                text: '产量（万m³）',
                style: {
                  color: '#E2F5FF'
                }
              },
            }, { // Secondary yAxis
              title: {
                text: '累计（万m³）',
                style: {
                  color: '#E2F5FF'
                }
              },
              labels: {
                format: '{value}',
                style: {
                  color: '#E2F5FF'
                }
              },
              opposite: true,
            }],
            tooltip: {
              shared: true
            },
            legend: {
              layout: 'vertical',
              align: 'left',
              x: 60,
              verticalAlign: 'top',
              y: 50,
              floating: true,
              itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
              }
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
              text: '运砂量统计(日)',
              style: {
                color: '#fff'
              }
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
                  color: '#E2F5FF'
                }
              },
              title: {
                text: '产量（万m³）',
                style: {
                  color: '#E2F5FF'
                }
              }
            }],
            tooltip: {
              shared: true
            },
            legend: {
              layout: 'vertical',
              align: 'left',
              x: 60,
              verticalAlign: 'top',
              y: 50,
              floating: true,
              itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
              }
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

      this.chartData = obj;
    });
  }
}
