import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notification: Subject<string> = new BehaviorSubject("");

  constructor() { }

  public events(): Observable<string> {
    return this.notification.asObservable();
  }

  public show(message: string): void {
    this.notification.next(message);
  }
}
