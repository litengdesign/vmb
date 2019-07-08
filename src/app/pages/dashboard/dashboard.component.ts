import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';
import { format } from 'date-fns';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  public breadcrumb = '实时潮位';
  public mapView: __esri.MapView;
  public listOfData = [];
  public map;
  public view;
  public showMenu = false;
  public popoverStyle = {
    left: '20px',
    top: '20px'
  };
  public showPop = false;
  public popoverObj: any = {};


  @ViewChild('dateTime') public dateTimeEl: ElementRef; //接收dom
  constructor() {
  }
  ngOnInit() {
    console.log(this.dateTimeEl)
    // first, we use Dojo's loader to require the map class
    loadModules([
      "esri/Map", "esri/views/MapView", "esri/Graphic",
      "esri/layers/TileLayer", 'dojo',
    ]).then(([Map, MapView, Graphic, TileLayer, dojo]) => {
        this.listOfData = [
           {
            lon:'120',
            lat:'30'
           }
        ];
        this.map = new Map({
          basemap: "hybrid"
        });
        //绘制底图
        var view = new MapView({
          center: [122, 31],
          container: "viewDiv",
          map: this.map,
          zoom: 2
        });
        //创建点
        var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [0, 134, 208],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };
        //遍历测点
        this.listOfData.forEach(element => {
          var point = {
            type: "point", // autocasts as new Point()
            longitude: element.lon,
            latitude: element.lat
          };
          element.tidalTime = element.tidalTime ? format(element.tidalTime, 'YYYY-MM-DD') : '暂无数据';
          element.tidalValue = element.tidalValue ? element.tidalValue + 'm' : '暂无数据'
          var template = {
            title: "{stationName}",
            content: ``
          }
          var pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: element,
            popupTemplate: template
          });
          // Add the graphics to the view's graphics layer
          view.graphics.add(pointGraphic);
        })
        // var layer = new TileLayer({
        //   url: "http://10.9.52.50:6080/arcgis/rest/services/TDT_Street/MapServer"
        // });
        // this.map.add(layer);
        // view.on('click',(event)=>{
        //   this.showPop = true;
        //   this.popoverObj = {
        //     lat: Math.round(event.mapPoint.latitude* 1000) / 1000,
        //     lon: Math.round(event.mapPoint.longitude* 1000) / 1000
        //   };
        //   this.popoverStyle = {
        //     left:(event.x+30)+'px',
        //     top: (event.y-230)+'px',
        //   }
        // })
        let componentHost = this.dateTimeEl;
        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {
            if (response.results[0]) {
              

            }
          })
        });




    })
      .catch(err => {
        console.error(err);
      });
  }
  gotoPoint(item) {
    this.view.goTo({
      center: [item.lon, item.lat],
    })
    // this.view.popup.open()
    this.view.popup.open({
      // Set the popup's title to the coordinates of the clicked location
      title: `站点名称：${item.stationName}`,
      content: `<ul><li>站点编号：${item.stationCode}</li>
                <li>潮位高度：${item.tidalValue}</li>
                <li>回报时间：${item.tidalTime}</li></ul>`,
      location: [item.lon, item.lat] // Set the location of the popup to the clicked location
    });
  }
}
