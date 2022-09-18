import { Component, Input, HostListener, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { Country } from 'src/app/models/country';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {

  @Input() deep!: number;
  @Input() employee!: Employee;
  @Input() countries!: Country[];

  @ViewChild('details') input!: ElementRef<HTMLDivElement>;

  isOpen: boolean = false;
  isDetailsVisible: boolean = false;

  constructor(private renderer: Renderer2, private dialog: MatDialog, private api: ApiService) { }

  public toggleOpen(): void {
    if(this.employee.teamSize > 0) {
      if(this.employee.employees.length > 0) {
        this.isOpen = !this.isOpen;
      } else {
        this.api.get<Employee>("employees/" + this.employee.id + "?onlyDirectTeam=true&filterResigned=true").subscribe(employee => {
          this.employee = employee;
          this.isOpen = true;
        });
      }
    }
  }

  public arrowUrl(): string {
    return this.isOpen ? 'assets/arrowbottom.png' : 'assets/arrowleft.png';
  }

  public progressSalary(): number {
    if(this.employee?.salary) {
      var temp = this.employee.salary - 20000;
      return temp * 100 / 40000;
    }
    return 0;
  }

  public edit($event: MouseEvent): void {
    $event.stopPropagation();
    var savedData = JSON.parse(JSON.stringify(this.employee)); // Deep copy
    this.dialog.open(EditEmployee, { width: '480px', data: {employee: this.employee, countries: this.countries }}).afterClosed().subscribe(result => {
      this.employee = result ? result : savedData;
    });
  }

  @HostListener('mousemove', ['$event'])
  public mouseMove($event: MouseEvent) {
    if(this.input?.nativeElement) {
      this.renderer.setStyle(this.input?.nativeElement, "left", ($event.clientX + 30) + "px");
      this.renderer.setStyle(this.input?.nativeElement, "top", ($event.clientY - 15) + "px");
    }
  }
}

@Component({
  selector: 'dialog-edit-employee',
  template: ' <h1 mat-dialog-title>Modification</h1>\
              <div mat-dialog-content *ngIf="data.employee">\
                <mat-form-field appearance="fill">\
                  <mat-label>Prénom</mat-label>\
                  <input matInput [(ngModel)]="data.employee.firstname">\
                </mat-form-field>&nbsp;\
                <mat-form-field appearance="fill">\
                  <mat-label>Nom</mat-label>\
                  <input matInput [(ngModel)]="data.employee.lastname">\
                </mat-form-field>\
                <mat-form-field appearance="fill">\
                  <mat-label>Salaire</mat-label>\
                  <input matInput [(ngModel)]="data.employee.salary" type="number">\
                </mat-form-field>&nbsp;\
                <mat-form-field appearance="fill">\
                  <mat-label>Pays</mat-label>\
                  <mat-select [(ngModel)]="data.employee.country" name="country" [compareWith]="compareCountries">\
                    <mat-option *ngFor="let country of data.countries" [value]="country">\
                      {{country.labelFr}}\
                    </mat-option>\
                  </mat-select>\
                </mat-form-field>\
              </div>\
              <br />\
              <div mat-dialog-actions>\
                <button mat-raised-button mat-dialog-close color="basic">Annuler</button>&nbsp;\
                <button mat-raised-button (click)="save(data.employee)" color="primary" cdkFocusInitial>Enregistrer</button>\
              </div>'
})
export class EditEmployee {

  compareCountries = Country.compareCountries; 

  constructor(public dialogRef: MatDialogRef<EditEmployee>, private api: ApiService, @Inject(MAT_DIALOG_DATA) public data: { employee: Employee, countries: Country[] }) { }

  public save(employee: Employee): void {
    this.api.post("employees", employee).subscribe(success => this.close(employee));
  }
  public close(employee: Employee): void {
    this.dialogRef.close(employee);
  } 
}