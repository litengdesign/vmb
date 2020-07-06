import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ServersService} from '../../../../servers.service';
import { environmentAutomonitor} from '../../../../../environments/environment';
@Component({
  selector: 'app-automonitor-alert',
  templateUrl: './automonitor-alert.component.html',
  styleUrls: ['./automonitor-alert.component.less']
})
export class AutomonitorAlertComponent implements OnInit {
  public api_list = '/api/AlertManage/GetAlertMessageList'; // 页面数据列表api
  // 列表相关数据
  public displayData: any = []; //存储列表数据
  public isLoading = false; //用于加载效果
  public pageIndex = 1;          //初始页码
  public pageSize = 10;         //显示行数
  public total = 1;         //总条数
  public Sord = null;       //正反序
  public OrderBy = null;    //排序字段
  public loading = true;    //开启加载
  public Sidx = '0';
  public colData = null;
  public Origin = environmentAutomonitor.Origin;

  constructor(public ServersService: ServersService) { }

  ngOnInit(): void {
    this.getDataList();
  }
  //获取列表数据
  getDataList() {
    this.loading = true;
    let options = {
      origin:environmentAutomonitor.Origin,
      api: this.api_list,
      params: {
        page:1,
        pageSize: 100,
        Sidx:'alertTime',
        Sord:'desc'
      }
    }
    this.ServersService.getRxjsData(options).subscribe((data: any) => {
      this.loading = false;
      this.total = data.total;
      this.colData = data.data;
      this.displayData = [...this.colData];
    })
  }
}
