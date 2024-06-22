import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageVisibilityService {
  private visibilityChange = new Subject<boolean>();

  visibilityChange$ = this.visibilityChange.asObservable();

  constructor(private ngZone: NgZone) {
    this.initializeVisibilityListener();
  }

  private initializeVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      this.ngZone.run(() => {
        this.visibilityChange.next(!document.hidden);
      });
    });
  }
}
