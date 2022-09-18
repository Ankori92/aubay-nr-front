import { Country } from "./country";

export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    entryDate: Date;
    salary: number;
    country: Country;
    teamSize: number;
    employees: Employee[];

    constructor(id: number, firstname: string, lastname: string, entryDate: Date, salary: number, country: Country, teamSize: number, employees: Employee[]) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.entryDate = entryDate;
        this.salary = salary;
        this.country = country;
        this.teamSize = teamSize;
        this.employees = employees;
    }
}