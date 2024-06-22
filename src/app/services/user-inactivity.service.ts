import { Injectable, NgZone } from '@angular/core';
import { debounceTime, fromEvent, mapTo, merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInactivityService {
  private idleTimeoutInMs: number = 1000; // 1 seconde
  public onIdle: Subject<void> = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
    this.init();
  }

  private init() {
    const userEvents$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'mousedown'),
      fromEvent(window, 'keypress'),
      fromEvent(window, 'scroll')
    );

    this.ngZone.runOutsideAngular(() => {
      userEvents$
        .pipe(
          startWith(null),
          debounceTime(this.idleTimeoutInMs),
          mapTo(undefined),
          switchMap(() => this.ngZone.run(() => this.onIdle)),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.onIdle.next());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
