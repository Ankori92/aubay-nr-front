import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber, Observer } from 'rxjs';
import { Error } from '../../models/error'; 
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public apiUrl: string = "//localhost:8080/";

  public defaultConfig = {
    withCredentials: true,
    disableErrorHandler: false
   };

  constructor(private http: HttpClient, private notificationService: NotificationService, private router: Router) { }

  /**
   * Get request to API
   * @param url 
   */
  public get<T>(url: string, conf: any = this.defaultConfig): Observable<T> {
    return this.doRequest(url, HttpMethod.GET, null, conf);
  }

  /**
   * Post request to API
   * @param url 
   * @param body 
   */
  public post<T>(url: string, body: any = null, conf: any = this.defaultConfig): Observable<T> {
    return this.doRequest(url, HttpMethod.POST, body, conf);
  }

  /**
   * Delete request to API
   * @param url 
   */
  public delete<T>(url: string, conf: any = this.defaultConfig): Observable<T> {
    return this.doRequest(url, HttpMethod.DELETE, null, conf);
  }

  /**
   * Put request to API
   * @param url 
   * @param body 
   */
  public put<T>(url: string, body: any = null, conf: any = this.defaultConfig): Observable<T> {
    return this.doRequest(url, HttpMethod.PUT, body, conf);
  }

  /**
   * Patch request to API
   * @param url 
   * @param body 
   */
  public patch<T>(url: string, body: any = null, conf: any = this.defaultConfig): Observable<T> {
    return this.doRequest(url, HttpMethod.PATCH, body, conf);
  }
  
  /**
   * Request to API
   * @param url 
   * @param method 
   * @param body
   */
  private doRequest<T>(url: String, method: HttpMethod = HttpMethod.GET, body: any = null, conf: any = this.defaultConfig): Observable<T> {
    const config = this.mergeWithDefaultConfig(conf);
    const httpConf = { withCredentials: config.withCredentials };
    return new Observable<T>((observer) => {
      if(method == HttpMethod.GET) {
        this.http.get<T>(this.apiUrl + url, httpConf).subscribe(this.requestObserver(observer, config));
      } else if(method == HttpMethod.POST) {
        this.http.post<T>(this.apiUrl + url, body, httpConf).subscribe(this.requestObserver(observer, config));
      } else if(method == HttpMethod.DELETE) {
        this.http.delete<T>(this.apiUrl + url, httpConf).subscribe(this.requestObserver(observer, config));
      } else if(method == HttpMethod.PUT) {
        this.http.put<T>(this.apiUrl + url, body, httpConf).subscribe(this.requestObserver(observer, config));
      } else if(method == HttpMethod.PATCH) {
        this.http.patch<T>(this.apiUrl + url, body, httpConf).subscribe(this.requestObserver(observer, config));
      }
    });
  }

  /**
   * Build a generic Observer
   * Add a default Error Handler with notifications.
   * Notifications may be disabled with config object {disableErrorHandler: true}
   * @param observer 
   * @param config 
   * @returns 
   */
  private requestObserver<T>(observer: Subscriber<T>, config: any = this.defaultConfig): Partial<Observer<T>> {
    return {
      next: success => observer.next(success), 
      error: error => config.disableErrorHandler ? observer.error(error) : this.handleApiError<T>(error, observer),
      complete: () => observer.complete()
    };
  }

  /**
   * Merge user's config with default config
   * @param config 
   */
   private mergeWithDefaultConfig(config: any = this.defaultConfig) {
    // Duplicate default config
    const result: any = Object.assign({}, this.defaultConfig);
    // Replace all user defined config
    for (const property in config) {
      result[property] = config[property];
    }
    return result;
  }

  /**
   * Default ApiError handler.
   * 0: API unreachable
   * 401: Authentication needed 
   * @param error 
   * @param observer
   */
  private handleApiError<T>(error: Error, observer: Subscriber<T>) {
    if(error.status == 0) { 
      this.notificationService.show("Il semble que l'API ne soit pas joignable");
    } else if(error.status == 401) { 
      this.notificationService.show("Vous êtes déconnecté, merci de vous reconnecter");
      this.router.navigate(['login'], { state : {'logout' : true }});
    } else if(error.message != null) {
      this.notificationService.show(error.message);
    }
    observer.error(error);
  }
}

/**
 * All supported HttpMethods
 */
enum HttpMethod {
  GET, POST, DELETE, PUT, PATCH
}