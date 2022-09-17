import { Employee } from "./employee";
import { LangEnum } from "./lang";

export class User {
    username: string;
	preferredLang: LangEnum;
	authorities: string[];
	employee: Employee;

	constructor(username: string, preferredLang: LangEnum, authorities: string[], employee: Employee) {
		this.username = username;
		this.preferredLang = preferredLang;
		this.authorities = authorities;
		this.employee = employee;
	}
}