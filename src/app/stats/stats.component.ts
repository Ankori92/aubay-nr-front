import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Statistic, StatisticsWrapper } from 'src/app/models/stats';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  displayedColumns: string[] = ['uri', 'queries', 'duration', 'weight', 'api', 'checked'];
  selectedUris: string[] = [];
  selectedDataType: 'duration' | 'queries' = 'duration';
  loading: boolean = false;
  statisticsByPeriods: [string, Statistic[]][] = [];
  statisticsGlobal: Statistic[] = [];

  constructor(private api: ApiService, private dialog: MatDialog, private notif: NotificationService) { }

  ngOnInit(): void {
    var statisticsGlobal = localStorage.getItem("StatsComponent.statisticsGlobal");
    var statisticsByPeriods = localStorage.getItem("StatsComponent.statisticsByPeriods");
    if(statisticsGlobal && statisticsByPeriods) {
      this.statisticsGlobal = JSON.parse(statisticsGlobal);
      this.statisticsByPeriods = JSON.parse(statisticsByPeriods);
      for(let stat of this.statisticsGlobal) {
        stat.checked = true;
        this.selectUri(stat.uri);
      }
    } else {
      this.refreshData();
    }
  }

  public refreshData(): void {
    this.statisticsByPeriods = []
    this.loading = true;
    this.api.get<StatisticsWrapper>("stats").subscribe(stats => {
      this.statisticsByPeriods = Object.entries(stats.byPeriod).sort((a, b) => a[0].localeCompare(b[0]));
      this.statisticsGlobal = stats.global;
      localStorage.setItem("StatsComponent.statisticsGlobal", JSON.stringify(this.statisticsGlobal));
      localStorage.setItem("StatsComponent.statisticsByPeriods", JSON.stringify(this.statisticsByPeriods));
      this.loading = false;
      for(let stat of this.statisticsGlobal) {
        stat.checked = true;
        this.selectUri(stat.uri);
      }
    });
  }

  public chartData(uri: string, $event: MatCheckboxChange) {
    this.selectedUris = this.selectedUris.concat(); // Change object reference for changes detection
    if($event.checked) {
      this.selectUri(uri);
    } else {
      this.unselectUri(uri);
    }
    this.statisticsGlobal.forEach(stat => {
      if(stat.uri == uri) {
        stat.checked = $event.checked;
      }
    });
  }

  public resetStats(): void {
    this.dialog.open(ResetStatisticsConfirmation, { width: '350px' }).afterClosed().subscribe(result => {
      if(result) {
        this.statisticsByPeriods = [];
        this.statisticsGlobal = [];
      }
    });
  }
  
  public checkAllData($event: MatCheckboxChange): void {
    this.statisticsGlobal.forEach(stat => this.chartData(stat.uri, $event));
  }

  public initData(): void {
    this.api.post("init").subscribe(success => this.notif.show("D'autres données ont été générées et ajoutées en base de données"));
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
  constructor(private dialogRef: MatDialogRef<ResetStatisticsConfirmation>, private api: ApiService) {}

  public resetData(): void {
    this.api.delete("stats").subscribe(success => this.close(true));
  }

  public close(reset: boolean): void {
    this.dialogRef.close(reset);
  }
}