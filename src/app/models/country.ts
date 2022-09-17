export class Country {
    code: string;
    labelFr: string;
    labelEn: string;

    constructor(code: string, labelFr: string, labelEn: string) {
        this.code = code;
        this.labelFr = labelFr;
        this.labelEn = labelEn;
    }

    public static compareCountries(o1: any, o2: any): boolean {
      return o1.code === o2.code;
    }
}