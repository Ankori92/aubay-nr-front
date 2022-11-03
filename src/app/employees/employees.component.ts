import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { CacheService } from '../core/services/cache.service';
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

  constructor(private api: ApiService, private cache: CacheService) { }

  ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(forceReload: boolean = false): void {
    if(forceReload) {
      this.api.delete("cache").subscribe(() => {
        this.reloadEmployees(forceReload);
        this.reloadCountries(forceReload);
      });
    } else {
      this.reloadEmployees(forceReload);
      this.reloadCountries(forceReload);
    }
  }

  private reloadEmployees(forceReload: boolean): void {
    const cachedItemName = "EmployeesComponent.employees";
    var cachedEmployees = this.cache.getCachedItem(cachedItemName);
    if(cachedEmployees && !forceReload) {
      this.employees = JSON.parse(cachedEmployees);
    } else {
      this.employees = [];
      this.api.get<Employee[]>("employees/top").subscribe(employees => {
        this.employees = employees;
        this.cache.cacheItem(cachedItemName, JSON.stringify(this.employees));
      });
    }
  }

  private reloadCountries(forceReload: boolean): void {
    const cachedItemName = "EmployeesComponent.countries";
    var cachedCountries = this.cache.getCachedItem(cachedItemName);
    if(cachedCountries && !forceReload) {
      this.countries = JSON.parse(cachedCountries);
    } else {
      this.countries = [];
      this.api.get<Country[]>("countries").subscribe(countries => {
        this.countries = countries;
        this.cache.cacheItem(cachedItemName, JSON.stringify(this.countries));
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