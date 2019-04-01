import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServersService } from '../../servers.service';

@Component({
  selector: 'app-premission',
  templateUrl: './premission.component.html',
  styleUrls: ['./premission.component.less']
})
export class PremissionComponent implements OnInit {
  @Output('read') readFtn = new EventEmitter<any>();
  @Output('update') updateFtn = new EventEmitter<any>();
  @Output('delete') deleteFtn = new EventEmitter<any>();
  constructor(public server: ServersService) { }

  ngOnInit() {
    //获取权限
  }
  read() {
    this.readFtn.emit();
  }
  update() {
    this.updateFtn.emit();
  }
  delete() {
    this.deleteFtn.emit();
  }
}
