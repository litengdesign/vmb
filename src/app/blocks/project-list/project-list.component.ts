import { Component, OnInit } from '@angular/core';
import { ServersService } from '../../servers.service';
import { LoadmoreService } from '../../services/loadmore.service'
import { environment,environmentVolum } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MapService } from '../../services/map.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.less']
})
export class ProjectListComponent implements OnInit {
  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];
  public apiList = '/api/ProjectManage/GetPorjectList';
  public pageSize = 10;  // 显示行数
  public total = 0;      // 总条数
  public pageIndex = 1;  // 初始页码
  public navigateClose = true;
  public keyword = '';
  public projectOrigin = environment.APIAutoDeform;
  constructor(
    public server: ServersService,
    public loadmoreService: LoadmoreService,
    public router: Router, public mapServer: MapService) { }

  ngOnInit() {
    this.getData();
    if (this.mapServer.visibleAIS) {
      this.server.map.remove(this.server.map.findLayerById('AIS_ShipLayer'));
      this.mapServer.buildAisFeature();
    }
  }
  getData(): void {
    this.keyword = this.server.keyword;
    this.pageIndex = this.keyword ? 1 : this.pageIndex;
    const options = {
      origin: environmentVolum.Origin,
      api: this.apiList,
      params: {
        Sidx: '0',
        Name: this.keyword ? this.keyword : '',
        Page: this.pageIndex,
        Rows: this.pageSize,
      }
    };
    this.server.getRxjsData(options).subscribe((res: any) => {
      this.data = res.pageResult.data;
      this.list = res.pageResult.data;
      this.total = res.pageResult.total;
      this.initLoading = false;
    });
  }

  onLoadMore(): void {
    const options = {
      origin: environmentVolum.Origin,
      api: this.apiList,
      params: {
        Sidx: '0',
        Name: this.keyword ? this.keyword : '',
        page: this.pageIndex,
        pageSize: this.pageSize,
      }
    };
    this.pageIndex++;
    this.loadingMore = true;
    this.list = this.data.concat([...Array(this.pageSize)].fill({}).map(() => ({ loading: true, name: {} })));
    this.server.getRxjsData(options).subscribe((res: any) => {
      this.data = this.data.concat(res.pageResult.data);
      this.list = [...this.data];
      this.total = res.pageResult.total;
      this.loadingMore = false;
    });
  }
  // 跳转项目详情
  locationToPoint(item: any): void {
    sessionStorage.setItem('projectInfo', JSON.stringify(item));
    this.router.navigate(['/integration/dashboard/projectDetail/' + item.projectId]);
    if (item.longitude && item.latitude) {
      this.server.view.goTo({
        center: [item.longitude, item.latitude],
        zoom: 13
      }, { duration: 1500 });
    }
  }
}
