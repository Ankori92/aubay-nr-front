import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { Usage } from 'src/app/models/usage';

@Component({
  selector: 'app-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['./stats-chart.component.css']
})
export class StatsChartComponent implements OnChanges {

  @Input() usages!: Usage[];
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
    var timestamps: Date[] = this.splitAnalyzedPeriod(this.valuesInChart, this.usages);
    var begin = timestamps[0];
    for(var i = 0 ; i < timestamps.length + 1 ; i++) {
      var end = i < timestamps.length ? timestamps[i] : new Date();
      labels.push(this.formatFrDate(end));
      data.push(this.aggregateDataBetween(begin, end));
      begin = end; // next !
    }
    this.refreshChart(labels, data);
  }

  private formatFrDate(d: Date): string {
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

  private aggregateDataBetween(begin: Date, end: Date): number {
    var total = 0;
    var countUsages = 0;
    this.usages.forEach(usage => {
      var date = new Date(usage.date);
      var isSelected = this.selectedUris.indexOf(usage.uri) != -1;
      if(isSelected && date >= begin && date < end) {
        total += usage[this.selectedDataType];
        countUsages++;
      }
    });
    if(this.selectedDataType == 'weight') {
      total = Math.round(total / 1000); // o -> Ko conversion
    }
    return countUsages == 0 ? 0 : total / countUsages;
  }

  private splitAnalyzedPeriod(nbSteps: number, data: Usage[]): Date[] {
    var olderUsageDate = this.findOlderUsageDate(data);
    var olderTimestamp = olderUsageDate.getTime();
    var stepDuration = (new Date().getTime() - olderTimestamp) / nbSteps;
    var result: Date[] = [];
    for(var i = 0 ; i < nbSteps ; i++) {
      result.push(new Date(olderTimestamp + i * stepDuration));
    }
    return result;
  }

  private findOlderUsageDate(usages: Usage[]) {
    var older = new Date();
    usages.forEach(usage => {
      var date = new Date(usage.date);
      older = date < older ? date : older;
    });
    return older;
  }
}
