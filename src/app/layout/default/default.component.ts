import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ServersService } from '../../servers.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit {
  constructor(public server:ServersService,public msg: NzMessageService, private router: Router,) { }

  public systemName = this.server.getSystemName();
  text: string = 'Admin';
  color: string = '#1890ff';
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  logoTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  //右侧消息弹框
  visible = false;
  childrenVisible = false;
  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
    this.logoTemplate = this.customTrigger;
  }
  //登出
  logout(): void {
    this.msg.info('退出成功!');
    this.router.navigateByUrl('/login');
  }
  //查看消息列表
  openMsg(): void{
    this.visible = true;
  }
  close(){
    this.visible = false;
  }
  ngOnInit() {
  }

}
