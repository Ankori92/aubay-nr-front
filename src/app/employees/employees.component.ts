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
        this.reloadData(forceReload);
      });
    } else {
      this.reloadData(forceReload);
    }
  }

  private reloadData(forceReload: boolean): void {
    const cachedItemName = "EmployeesComponent.homeInfos";
    var cachedHomeInfos = this.cache.getCachedItem(cachedItemName);
    if(cachedHomeInfos && !forceReload) {
      var homeInfos = JSON.parse(cachedHomeInfos);
      this.employees = homeInfos.employees;
      this.countries = homeInfos.countries;
    } else {
      this.employees = [];
      this.countries = [];
      this.api.get<HomeInfoDTO>("home").subscribe(homeInfos => {
        this.employees = homeInfos.employees;
        this.countries = homeInfos.countries;
        this.cache.cacheItem(cachedItemName, JSON.stringify(homeInfos));
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

export class HomeInfoDTO {
  countries: Country[];
  employees: Employee[];
  
  constructor(countries: Country[], employees: Employee[]) {
      this.countries = countries;
      this.employees = employees;
  }
}