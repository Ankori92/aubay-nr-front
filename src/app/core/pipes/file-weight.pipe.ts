import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'weight'})
export class WeightPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: number): SafeHtml {
    var result = "<span style='color:red;font-weight:bold;'>" + Math.round(value / 1000000) + " Mo</span>";
    if(value < 1000) {
      result = "<span style='color:#227a00'>" + Math.round(value) + " o</span>";
    } else if(value < 1000000) {
      result = "<span style='color:#4057ea'>" + Math.round(value / 1000) + " Ko</span>";
    } else if(value < 1000000 * 2) {
      result = "<span style='color:#ffb200'>" + Math.round(value / 1000000) + " Mo</span>";
    } else if(value < 1000000 * 5) {
      result = "<span style='color:red'>" + Math.round(value / 1000000) + " Mo</span>";
    } else if(value < 1000000 * 10) {
      result = "<span style='color:red;font-weight:bold;'>" + Math.round(value / 1000000) + " Mo</span>";
    }
    return this._sanitizer.bypassSecurityTrustHtml(result); // It's safe here :)
  }
}