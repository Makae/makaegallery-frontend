import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';

interface ScreenDimensions {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class CapabilityService {

  private screenDimensionSubject = new BehaviorSubject<ScreenDimensions | null>(null);

  public constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
      ).subscribe(() => {
      this.emitNextScreenDimensions();
    });
    this.emitNextScreenDimensions();
  }

  public screenDimensionChanged(): Observable<ScreenDimensions> {
    return this.screenDimensionSubject.asObservable().pipe(
      filter(value => !!value),
      map(value => value as ScreenDimensions)
    );
  }

  private emitNextScreenDimensions(): void {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    this.screenDimensionSubject.next({
      width: vw,
      height: vh
    })
  }
}
