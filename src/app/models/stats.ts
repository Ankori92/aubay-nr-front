export class Statistic {
    uri: string;
    date: Date;
    duration: number; 
    queries: number;
    weight: number;
    calls: number;
    checked: boolean;

    constructor(uri: string, date: Date, calls: number, duration: number, queries: number, weight: number, checked: boolean) {
        this.uri = uri;
        this.date = date;
        this.calls = calls;
        this.duration = duration;
        this.queries = queries;
        this.weight = weight;
        this.checked = checked;
    }
}

export class StatisticsWrapper {
    global: Statistic[];
    byPeriod: Map<number, Statistic[]>;
    constructor(global: Statistic[], byPeriod: Map<number, Statistic[]>) {
        this.global = global;
        this.byPeriod = byPeriod;
    }
}