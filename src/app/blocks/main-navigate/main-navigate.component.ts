import { Component, OnInit, Input, Output, EventEmitter, Pipe, ViewChild, SimpleChanges } from '@angular/core';
import { MapService } from '../../services/map.service'
@Component({
  selector: 'app-main-navigate',
  templateUrl: './main-navigate.component.html',
  styleUrls: ['./main-navigate.component.less']
})
export class MainNavigateComponent implements OnInit {
  @Input() navigateCloseValue: any; //接收父组件传递的图表配置参数
  public navigateOpen = true;
  constructor(public mapServer: MapService) {
    this.mapServer.navigateOpen.subscribe(res=>{
      this.navigateOpen = res;
    })
   }
  ngOnInit() {

  }
}
