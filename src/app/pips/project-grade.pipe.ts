import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectGrade'
})
export class ProjectGradePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let transformValue = "24";
    switch (value) {
      case "小型":
        transformValue = "24"
        break;
      case "中型":
        transformValue = "36"
        break;
      case "大型":
        transformValue = "48"
        break;
      case "超特大型":
        transformValue = "64"
        break;
      default:
        break;
    }
    return transformValue;

  }
}
