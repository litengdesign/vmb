import { Component, OnInit,Input } from '@angular/core';
import { ServersService } from '../../servers.service';
@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.less']
})
export class LogoComponent implements OnInit {
  @Input() theme: any; 
  constructor(public server: ServersService) { }

  ngOnInit() {
  }

}
