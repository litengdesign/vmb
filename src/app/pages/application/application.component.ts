import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {
  listOfData = []
  constructor() { }

  ngOnInit() {
    for(let i=0;i<100;i++){
      this.listOfData.push(
        {
          key: i+1,
          name: '自动化监测',
          desc: '自动化监测系统',
          createName: '张三',
          createDate: '2019-04-01',
        }
      )
    }
  }

}
