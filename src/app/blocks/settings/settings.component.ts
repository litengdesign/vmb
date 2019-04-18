import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  @Output('sendSetting') sendSettingFtn = new EventEmitter<any>();
  public settingOpen = false;
  // config
  public settings = {
    navbarHeaderColor: 'bg-black',
    navbarCollapseColor: 'bg-black',
    asideColor: 'bg-black',
    headerFixed: true,
    asideFixed: false,
    asideFolded: false
  }
  constructor() { }

  ngOnInit() {
  }
  sendData(navbarHeaderColor, navbarCollapseColor, asideColor){
    this.settings.navbarHeaderColor = navbarHeaderColor;
    this.settings.navbarCollapseColor = navbarCollapseColor;
    this.settings.asideColor = asideColor;
    this.sendSettingFtn.emit(this.settings);
  }


}
