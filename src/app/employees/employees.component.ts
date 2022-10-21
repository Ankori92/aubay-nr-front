import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Country } from '../models/country';
import { Employee } from '../models/employee';
import { Feedback } from '../models/feedback';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  countries: Country[] = [];

  constructor(private api: ApiService, private dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(forceReload: boolean = false): void {
    if(forceReload) {
      this.api.delete("cache").subscribe(() => {
        this.reloadEmployees(true);
        this.reloadCountries(true);
      });
    } else {
      this.reloadEmployees(false);
      this.reloadCountries(false);
    }
  }

  private reloadEmployees(forceReload: boolean): void {
    var employees = localStorage.getItem("EmployeesComponent.employees");
    if(employees && !forceReload) {
      this.employees = JSON.parse(employees);
    } else {
      this.employees = [];
      this.api.get<Employee[]>("employees/top").subscribe(employees => {
        this.employees = employees;
        localStorage.setItem("EmployeesComponent.employees", JSON.stringify(this.employees));
      });
    }
  }

  private reloadCountries(forceReload: boolean): void {
    var countries = localStorage.getItem("EmployeesComponent.countries");
    if(countries && !forceReload) {
      this.countries = JSON.parse(countries);
    } else {
      this.countries = [];
      this.api.get<Country[]>("countries").subscribe(countries => {
        this.countries = countries;
        localStorage.setItem("EmployeesComponent.countries", JSON.stringify(this.countries));
      });
    }
  }

  public nbEmployeesTotal(): number {
    return this.employees.length;
  }

  public nbEmployees(employee: Employee): number {
    var count = 1; // Manager
    if(employee.employees) {
      count += employee.teamSize; // Employees
    }
    return count;
  }

    public sendFeedback($event: MouseEvent): void {
    $event.stopPropagation();
    this.dialog.open(SendFeedback, { width: '480px', data: {Feedback: "" }})
    //.afterClosed().subscribe(result => { this.employee = result ? result : savedData;})
    ;
    }
}

@Component({
  selector: 'dialog-send-feedback',
   template: ' <h1 mat-dialog-title>Feedback</h1>\
               <div mat-dialog-content>\
                 <mat-form-field appearance="fill">\
                   <mat-label>Feedback</mat-label>\
                   <input matInput [(ngModel)]="data.feedback">\
                 </mat-form-field>&nbsp;\
               </div>\
               <br />\
               <div mat-dialog-actions>\
                 <button mat-raised-button mat-dialog-close color="basic">Annuler</button>&nbsp;\
                 <button mat-raised-button (click)="save(data.feedback)" color="primary" cdkFocusInitial>Envoyer</button>\
               </div>'
})
export class SendFeedback {

  constructor(public dialogRef: MatDialogRef<SendFeedback>, private api: ApiService, @Inject(MAT_DIALOG_DATA) public data: { feedback: string }) { }

  public save(feedback: string): void {
    this.api.post("feedbacks", feedback).subscribe(success => this.close(feedback));
  }
  public close(feedback: string): void {
    this.dialogRef.close(feedback);
  }
}