import { Component, OnInit } from '@angular/core';
import { ComomService} from '../../../../shared/servers.service'
import { environmentProject} from '../../../../../environments/environment';
@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.less']
})
export class ProjectInfoComponent implements OnInit {
  // api
  public Api = '/api/ProjectManager/GetProjectById';//根据id获取工程详情
  //其他参数
  public projectInfo:any = {};
  constructor(public comomServer:ComomService) {
    this.comomServer.selectedProject.subscribe(res => {
      if (res) {
        this.getprojectInfo(res);
      }
    })
  }

  ngOnInit(): void {
     this.getprojectInfo('747e1748-eb41-11e9-9589-005056b24df6');
  }
  getprojectInfo(id){
    let options = {
      origin: environmentProject.Origin,
      api:this.Api,
      params: {
        id: id
      }
    }
    this.comomServer.getRxjsData(options).subscribe(data=>{
      this.projectInfo = data.data;
    })
  }
  

}
