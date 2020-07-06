import { Component, OnInit, Output, EventEmitter, Pipe } from '@angular/core';
import {  ServersService  } from '../../servers.service'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  @Output('checked') checkedBack = new EventEmitter<any>();
  constructor(public server: ServersService,) { }

  ngOnInit() {
  }
  searchKeyword(reset?){
    this.checkedBack.emit();
  }
}
