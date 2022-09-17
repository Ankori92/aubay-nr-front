import { Country } from "./country";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    entryDate: Date;
    salary: number;
    country: Country;
    manager: Employee | null;
    employees: Employee[];

    constructor(id: number, firstname: string, lastname: string, entryDate: Date, salary: number, country: Country, manager: Employee | null, employees: Employee[]) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.entryDate = entryDate;
        this.salary = salary;
        this.country = country;
        this.manager = manager;
        this.employees = employees;
    }
}