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
    this.refreshData();
  }

  public refreshData(forceReload: boolean = false): void {
    this.reloadEmployees(forceReload);
    this.reloadCountries(forceReload);
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
    var count = 0;
    this.employees.forEach(emp => count += this.nbEmployees(emp));
    return count;
  }

  public nbEmployees(employee: Employee): number {
    var count = 1; // Manager
    if(employee.employees) {
      count += employee.teamSize; // Employees
    }
    return count;
  }
}