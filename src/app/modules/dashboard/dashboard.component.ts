import { Component, OnInit } from '@angular/core';
import { ServersService} from '../../servers.service';
import { fadeInAnimation, navigateAnimation } from '../../animations';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  animations: [fadeInAnimation]

})
export class DashboardComponent implements OnInit {
  constructor(public comomServer: ServersService) { }
  public visible = false;
    public apps = [
    {
      backgroundColor: '#4F72F0',
      typeName: '成本管控类',
      icon: 'icon-chengben',
      children: [
        {
          name: '砂船量方系统',
          description: '基于三维激光扫描技术的运砂船量方系统',
          type: '成本管控类',
          icon: 'icon-beibaoguanli',
          url: 'http://10.9.53.103:5600/#/dashboard/v1',
        },
        {
          name: '管道管线管理系统',
          description: '钢制排泥管线智能化管理系统',
          type: '成本管控类',
          icon: 'icon-guanxian',
          url: 'http://pl.cccc-cdc.com'
        }
      ]
    },
    {
      backgroundColor: '#00C5D1',
      typeName: '安全监管类',
      icon: 'icon-anquanshengchan',
      children: [
        {
          name: '安全隐患排查系统',
          url: 'http://hdi.cccc-cdc.com',
          description: '安全隐患排查系统',
          type: '安全监管类',
          icon: 'icon-anquanshengchan2'
        },
        {
          name: '综合安防管理平台',
          url: 'https://180.169.140.141:8008',
          description: '综合安防管理平台',
          type: '安全监管类',
          icon: 'icon-anfang'
        },
        {
          name: '隧道人员定位救援系统',
          url: 'http://track.ubitraq.com/login/index.html',
          description: '隧道内人员定位救援系统',
          type: '安全监管类',
          icon: 'icon-renyuandingwei2'
        },
        {
          name: '自动化变形监测',
          url: 'http://10.9.53.103:8090',
          description: '结构体自动化变形/位移监测系统',
          type: '安全监管类',
          icon: 'icon-zidongjiancezhan'
        }, {
          name: '生产调度系统',
          url: 'http://10.9.53.103:5300',
          description: '大面积精密分区填海项目生产调度系统',
          type: '安全监管类',
          icon: 'icon-shengchantiaodu'
        },
        {
          name: '考勤管理系统',
          url: 'http://47.103.92.191:8080/Account/Login?ReturnUrl=%2F#/statistical',
          description: '考勤管理系统',
          type: '安全监管类',
          icon: 'icon-kaoqin1'
        },
      ]
    },
    {
      backgroundColor: '#00C7A2',
      typeName: '质量技术类',
      icon: 'icon-jishu',
      children: [
        {
          name: '水运工程潮位云平台',
          url: 'http://10.9.53.103:5900',
          description: '实时潮位采集及发布系统',
          type: '质量技术类',
          icon: 'icon-chaoweiyubaoiconx'
        }
      ]

    }
  ];
  public isMobile = window.screen.width < 576 ? true : false;
  ngOnInit(): void {
  }
}
