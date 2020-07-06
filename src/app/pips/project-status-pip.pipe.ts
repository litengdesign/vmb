import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectStatusPip'
})
export class ProjectStatusPipPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let transformValue = "processing";
    switch (value) {
      case "401":
        transformValue =  "default"
        break;
      case "304":
        transformValue =  "success"
        break;
      case "301":
        transformValue =  "processing"
        break;
      case "201":
        transformValue =  "warning"
        break;
      default:
        break;
    }
    return transformValue;

  }

}
