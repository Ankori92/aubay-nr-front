import { LOCALE_ID, DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgChartsModule } from 'ng2-charts';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';

import { AppComponent } from './app.component';
import { NotificationComponent } from './core/notification/notification.component';
import { TopBarComponent } from './core/top-bar/top-bar.component';
import { LoginComponent } from './core/login/login.component';
import { EmployeesComponent } from './employees/employees.component';
import { AuthGuard } from './core/login/auth.guard';
import { TeamComponent, EditEmployee } from './employees/team/team.component';
import { ResetStatisticsConfirmation, StatsComponent } from './stats/stats.component';
import { StatsChartComponent } from './stats/stats-chart/stats-chart.component';
import { WeightPipe } from './core/pipes/file-weight.pipe';
import { DurationPipe } from './core/pipes/duration.pipe';
import { CountPipe } from './core/pipes/count.pipe';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '',             component: EmployeesComponent,  canActivate: [ AuthGuard ] },
      { path: 'employees',    component: EmployeesComponent,  canActivate: [ AuthGuard ] },
      { path: 'application',  component: StatsComponent,      canActivate: [ AuthGuard ] },
      { path: 'login',        component: LoginComponent },
    ]),
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTableModule,
    NgChartsModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    NotificationComponent,
    LoginComponent,
    EmployeesComponent,
    TeamComponent,
    StatsComponent,
    StatsChartComponent,
    ResetStatisticsConfirmation,
    EditEmployee,
    WeightPipe,
    DurationPipe,
    CountPipe
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
  ]
})
export class AppModule { }
