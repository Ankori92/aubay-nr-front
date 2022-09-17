import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Country } from '../models/country';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  countries: Country[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.get<Employee[]>("employees/top?filterResigned=true").subscribe(employees => this.employees = employees);
    this.api.get<Country[]>("countries").subscribe(countries => this.countries = countries);
  }

  public nbEmployeesTotal(): number {
    var count = 0;
    this.employees.forEach(emp => count += this.nbEmployees(emp));
    return count;
  }

  public nbEmployees(employee: Employee): number {
    var count = 1; // Manager
    if(employee.employees) {
      employee.employees.forEach(emp => count += this.nbEmployees(emp)); // Employees
    }
    return count;
  }
}