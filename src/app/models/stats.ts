export class Statistic {
    uri: string;
    duration: number; 
    queries: number;
    weight: number;
    checked: boolean;
    elements: number;

    constructor(uri: string, elements: number, duration: number, queries: number, weight: number, checked: boolean) {
        this.uri = uri;
        this.elements = elements;
        this.duration = duration;
        this.queries = queries;
        this.weight = weight;
        this.checked = checked;
    }
}