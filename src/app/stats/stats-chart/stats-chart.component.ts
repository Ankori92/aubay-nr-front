import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { Statistic } from 'src/app/models/stats';

@Component({
  selector: 'app-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['./stats-chart.component.css']
})
export class StatsChartComponent implements OnChanges {

  @Input() statistics!: [string, Statistic[]][];
  @Input() selectedUris!: string[];
  @Input() selectedDataType!: 'duration' | 'queries' | 'weight';
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  
  public valuesInChart: number = 20;
  public chartOptions: ChartOptions<'bar'> = { responsive: false, scales:{ y: { suggestedMin: 0 }}};
  public chartData!: ChartConfiguration<'bar'>['data'];

  constructor() { }
  
  ngOnChanges(): void {
    var labels: string[] = [];
    var data: number[] = [];
    this.statistics.forEach(stat => {
      var date: any = stat[0];
      var total = 0;
      var nb = 0;
      labels.push(this.formatFrDate(new Date(date*1)));
      for(let s of stat[1]) {
        if(this.selectedUris.indexOf(s.uri) == -1) {
          continue;
        }
        total += this.selectedDataType == 'duration' ? s.duration : this.selectedDataType == 'queries' ? s.queries : Math.round(s.weight / 1000);
        nb++;
      }
      data.push(total/nb);
    });
    this.refreshChart(labels, data);
  }

  private formatFrDate(d: Date): string {
    d = new Date(d);
    const date = (d.getDate() < 10 ? "0" : "") + d.getDate();
    const month = (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1);
    const year = d.getFullYear();
    return date + "/" + month + "/" + year;
  }

  private refreshChart(labels: string[], data: number[]): void {
    this.chartData = {
      labels: labels,
      datasets: [{
        data: data,
        label: this.getTitle(),
        borderColor: 'black',
        backgroundColor: '#1976d2'
      }]
    };
    this.chart?.chart?.update();
  }

  private getTitle(): string | undefined {
    switch(this.selectedDataType) {
      case 'duration':
        return 'Temps de réponse de l\'API (en ms)';
      case 'queries':
        return 'Nombre de requêtes SQL par appel API';
      case 'weight':
        return 'Poids des réponses (en Ko)';
    }
  }
}
