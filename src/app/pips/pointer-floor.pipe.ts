import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointerFloor'
})
export class PointerFloorPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return Math.floor(value * 100) / 100;
  }
}
