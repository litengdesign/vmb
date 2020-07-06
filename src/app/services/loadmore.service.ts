import { Injectable } from '@angular/core';
import { ServersService } from '../servers.service';
import { Observable, forkJoin } from 'rxjs';
interface getListParams {
  origin:string,
  api: string,
  params:any;
  data: any[]
}
@Injectable({
  providedIn: 'root'
})
export class LoadmoreService {

  list: Array<{ loading: boolean; name: any }> = [];
  constructor(public server: ServersService) { }
  //加载更多方法
  onLoadMore(params: getListParams) {
    return new Observable<any>((observer) => {
      this.list = params.data.concat([...Array(10)].fill({}).map(() => ({ loading: true, name: {} })));
      this.server.getRxjsData(params).subscribe((res: any) => {
        params.data = params.data.concat(res.data);
        this.list = [...params.data];
        observer.next({
          
        });
      });
    })
  }
}
