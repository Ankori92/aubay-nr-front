import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Statistic } from 'src/app/models/stats';
import { Usage } from 'src/app/models/usage';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  displayedColumns: string[] = ['uri', 'queries', 'duration', 'weight', 'api', 'checked'];
  selectedUris: string[] = [];
  selectedDataType: 'duration' | 'queries' = 'duration';
  loading: boolean = true;
  statistics: Statistic[] = [];
  usages: Usage[] = [];

  constructor(private api: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(): void {
    this.usages = [];
    this.statistics = [];
    this.loading = true;
    this.selectedUris = [];
    this.api.get<Usage[]>("stats").subscribe(usages => this.buildStats(usages));
  }
  
  private buildStats(usages: Usage[]): void {
    var map: { [uri: string]: Statistic } = {};
    // Sum usages by URI
    usages.forEach(usage => {
      this.selectUri(usage.uri);
      var total = map[usage.uri];
      if(!total) {
        total = { uri: usage.uri, queries: 0, duration: 0, weight: 0, elements: 0, checked: usage.checked };
        map[usage.uri] = total;
      }
      total.queries += usage['queries'];
      total.duration += usage['duration'];
      total.weight += usage['weight'];
      total.elements++;
    });
    // Compute average queries / durations
    var statistics: Statistic[] = [];
    for (const property in map) {
      var queries  = map[property].queries;
      var elements = map[property].elements;
      var duration = map[property].duration;
      var weight = map[property].weight;
      statistics.push({
        uri: property,
        elements: elements,
        queries: queries / elements,
        duration: duration / elements,
        weight: weight / elements,
        checked: true
      });
    }
    // Save results
    this.usages = usages;
    this.statistics = statistics;
    this.loading = false;
  }

  public chartData(uri: string, $event: MatCheckboxChange) {
    this.selectedUris = this.selectedUris.concat(); // Change object reference for changes detection
    if($event.checked) {
      this.selectUri(uri);
    } else {
      this.unselectUri(uri);
    }
    this.statistics.forEach(stat => {
      if(stat.uri == uri) {
        stat.checked = $event.checked;
      }
    });
  }


  public resetStats(): void {
    this.dialog.open(ResetStatisticsConfirmation, { width: '350px', data: { selectedUris: this.selectedUris } }).afterClosed().subscribe(result => {
      if(result) {
        this.refreshData();
      }
    });
  }
  
  public checkAllData($event: MatCheckboxChange): void {
    this.statistics.forEach(stat => this.chartData(stat.uri, $event));
  }

  private selectUri(uri: string) {
    if(this.selectedUris.indexOf(uri) == -1) {
      this.selectedUris.push(uri);
    }
  }

  private unselectUri(uri: string) {
    this.selectedUris.splice(this.selectedUris.indexOf(uri), 1);
  }
}

@Component({
  selector: 'dialog-confirm-reset',
  template: ' <h1 mat-dialog-title>Suppression des données</h1>\
              <div mat-dialog-content>\
                La base de données va être nettoyée.<br />\
                Voulez-vous continuer ?\<br />\
              </div>\<br />\
              <div mat-dialog-actions>\
                <button mat-button mat-dialog-close (click)="close(false)">Annuler</button>&nbsp;\
                <button mat-button mat-dialog-close cdkFocusInitial (click)="resetData()" color="warn">Supprimer les données</button>\
              </div>',
})
export class ResetStatisticsConfirmation {
  constructor(private dialogRef: MatDialogRef<ResetStatisticsConfirmation>, private api: ApiService, @Inject(MAT_DIALOG_DATA) public data: { selectedUris: string[] }) {}

  public resetData(): void {
    this.api.delete("stats", this.data.selectedUris).subscribe(success => this.close(true));
  }

  public close(reset: boolean): void {
    this.dialogRef.close(reset);
  }
}