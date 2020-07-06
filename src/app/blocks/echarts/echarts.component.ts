import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ServersService } from '../../servers.service';
@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.less']
})
export class EchartsComponent implements OnChanges, OnInit {
  @Input() chartOption: any; //接收父组件传递的图表配置参数
  @Input() isVisableClear: any; //接收父组件传递的图表配置参数
  public options = {};
  public isClear = false;
  public loading = true;
  constructor(private el: ElementRef, public server: ServersService) {
  }
  //判断组件绑定值变化
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartOption'] && changes['chartOption'].currentValue) {
      this.options = this.chartOption;
    }
    this.isClear = this.isVisableClear;
  }
  ngOnInit() {
  }

}
