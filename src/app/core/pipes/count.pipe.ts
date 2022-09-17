import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'count'})
export class CountPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: number): SafeHtml {
    var result = "<span style='color:red;font-weight:bold;'>" + Math.round(value) + " </span>";
    if(value < 5) {
      result = "<span style='color:#227a00'>" + Math.round(value) + " </span>";
    } else if(value < 10) {
      result = "<span style='color:#4057ea'>" + Math.round(value) + " </span>";
    } else if(value < 30) {
      result = "<span style='color:#ffb200'>" + Math.round(value) + " </span>";
    } else if(value < 100) {
      result = "<span style='color:red'>" + Math.round(value) + " </span>";
    } else if(value < 500) {
      result = "<span style='color:red;font-weight:bold;'>" + Math.round(value) + " </span>";
    }
    return this._sanitizer.bypassSecurityTrustHtml(result); // It's safe here :)
  }
}