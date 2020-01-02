import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  public systemName = '智慧工地集成平台2.0';
  //arcgis
  public map;
  public view;
  public layer;
  public tdtLayer;
  public annoTDTLayer;
  public tdtImgLayer;
  public annoImgTDTLayer;
  public zoom = 13;
  constructor() { }
}
