import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  /**
   * Cache item in localStorage
   * Handle Expiration date
   * @param cachedItemName key of cached item
   * @param cachedItem item to be placed in cache
   */
  public cacheItem(cachedItemName: string, cachedItem: string) {
    localStorage.setItem(cachedItemName, cachedItem);
    localStorage.setItem(cachedItemName + "_time", new Date().getTime().toString());
  }

  /**
   * Get an cached item by key (cachedItemName).
   * Expiration is default 1 hour, in milliseconds
   * @param cachedItemName 
   * @param expiration 
   * @returns 
   */
  public getCachedItem(cachedItemName: string, expiration: number = 1000 * 60 * 60): string | null {
    var timeItem = localStorage.getItem(cachedItemName + "_time");
    if(timeItem != null) {
      var cachedItem = localStorage.getItem(cachedItemName);
      if(new Date().getTime() < parseInt(timeItem) + expiration) {
        return cachedItem;
      }
    }
    return null;
  }
}
