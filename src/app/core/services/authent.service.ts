import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private user: User | null = null;
  private subject: Subject<User | null> = new BehaviorSubject(this.user);

  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Refresh authentication status (Ask whoami to API)
   */
  public refreshAuthStatus(disableErrorMessage: boolean = false): void {
    this.apiService.get<User>('whoami', { disableErrorHandler: disableErrorMessage }).subscribe({
        next: user => {
          this.user = user;
          this.subject.next(user);
          this.router.navigate(['']);
        }, 
        error: error => {
          this.subject.next(null);
          this.router.navigate(['/login']);
        }
    });
  }

  /**
   * Send logout request to server
   */
  public logout(): void {
    this.user = null;
    this.apiService.post('logout').subscribe(user => this.refreshAuthStatus(true));
    this.subject.next(null);
  }

  /**
   * Set the authenticated User
   */
  public setAuthentication(user: User): void {
    this.user = user;
    this.subject.next(user);
    this.router.navigate(['']);
  }

  /**
   * True if authenticated, false else
   */
  public isAuthenticated(): boolean {
    return this.user != null && this.user.username != null;
  }

  /**
   * Authentication Events
   * Suscribe to receive notification about authentication changes
   * @returns Observable<User|null>
   */
  public events(): Observable<User | null> {
    return this.subject.asObservable();
  }
}