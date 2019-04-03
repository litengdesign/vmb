import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  constructor() { }
  getSystemName(){
    return "应用权限管理系统"
  }
}
