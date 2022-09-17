import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: number): SafeHtml {
    var result = "<span style='color:red;font-weight:bold;'>" + Math.round(value / 1000 / 60) + " m</span>";
    if(value < 100) {
      result = "<span style='color:#227a00'>" + Math.round(value) + " ms</span>";
    } else if(value < 1000) {
      result = "<span style='color:#4057ea'>" + Math.round(value) + " ms</span>";
    } else if(value < 1000 * 3) {
      result = "<span style='color:#ffb200'>" + Math.round(value / 1000) + " s</span>";
    } else if(value < 1000 * 60) {
      result = "<span style='color:red'>" + Math.round(value / 1000) + " s</span>";
    } else if(value < 1000 * 60 * 60) {
      result = "<span style='color:red;font-weight:bold;'>" + Math.round(value / 1000 / 60) + " m</span>";
    }
    return this._sanitizer.bypassSecurityTrustHtml(result); // It's safe here :)
  }
}