import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ServersService } from '../../servers.service';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';
@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.less']
})
export class AlertListComponent implements OnInit {
  @Input() showDraw: any;
  @Output('closeDraw') closeDrawFn = new EventEmitter<any>();
  public visibleAlert = false;
  public childrenVisible = false;
  public visibleDetail = false;
  public openItem: any = {};
  //报警列表
  public systemList = [
    //变形监测报警列表
    {
      name:'变形监测报警',
      icon: 'icon-zidongjiancezhan',
      id: 'ADS',
      options: {
        origin: environment.APIAutoDeform,
        api: '/api/AlertManage/GetAlertMessageList',
        params: {
          Sidx: '0',
          Page: '1',
          Rows: '10',
          Name:''
        },
      },
      api_delete:'/api/AlertManage/ReadAlertMessage?id=',
      loading: false,
      total: 0,
      displayData: [],
      collapsible: false,
      loadingMore: false,
      initLoading:false,
    },
    //生产调度报警列表
    {
      name:'生产调度电子围栏警报',
      icon: 'icon-shengchantiaodu',
      id: 'PSS',
      options: {
        origin: environment.APISmartLocation,
        api: '/api/FencesAlarms/GetFenceAlarmList',
        params: {
          Sidx: '0',
          Page: '1',
          Rows: '10',
          Name:''
        }
      },
      api_delete: '/api/FencesAlarms/DeleteFenceAlarm?id=',
      loading: false,
      total: 0,
      displayData: [],
      collapsible: false,
      loadingMore:false,
      initLoading: false,
    }
  ]
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];
  visibleAlertStatus: Subject<boolean> = new Subject<boolean>();
  constructor(public server: ServersService) { 
  }
  ngOnInit() {

  }
  //判断组件绑定值变化
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['showDraw'] && changes['showDraw'].currentValue) ) {
      this.visibleAlert = this.showDraw;
      let adsAlert = this.server.forkRxjsData(this.systemList[0].options);
      let pssAlert = this.server.forkRxjsData(this.systemList[1].options);
      forkJoin([adsAlert, pssAlert]).subscribe((result: any) => {
        this.systemList[0].displayData = result[0].data;
        this.systemList[0].total = result[0].total;
        this.systemList[1].displayData = result[1].pageResult.data;
        this.systemList[1].total = result[1].pageResult.data.total;
        this.systemList[0].initLoading = false
        this.systemList[1].initLoading = false
      })
    }
  }
  getAlertList(system, reset: boolean = false) {
    system.options.params.Page = reset ? 1 : system.options.params.Page;
    system.loading = true;
    this.server.forkRxjsData(system.options).subscribe((data:any) => {
      system.loading = false;
      system.displayData = data.data || data.pageResult.data;
      system.total = data.pageResult?data.pageResult.data.total:data.total;
    })
  }
  closeDetail() {
    this.closeDrawFn.emit();
    this.visibleAlert = false;
    this.visibleDetail = false;
  }
  //删除报警
  deleteRow(item, system): void {
    const options = {
      origin: system.options.origin,
      api: system.api_delete + (item.id||item.deviceAlertLogId),
    }
    let postData = this.server.postRxjsData(options);
    postData.subscribe(() => {
      this.getAlertList(system);
    });
  }

  openChildren(data): void {
    data.isRead = true;
    this.openItem = data;
    this.childrenVisible = true;
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }

}
