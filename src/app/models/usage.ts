export class Usage {
    id: number;
    uri: string;
    date: Date;
    duration: number; 
    queries: number;
    weight: number;
    checked: boolean;

    constructor(id:number, uri:string, date: Date, duration: number, queries: number, weight: number) {
        this.id = id;
        this.uri = uri;
        this.date = date;
        this.duration = duration;
        this.queries = queries;
        this.weight = weight;
        this.checked = true;
    }
}