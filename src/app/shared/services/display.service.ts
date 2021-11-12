import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export interface DisplaySettings {
  fullscreen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  private readonly settingsSubject = new BehaviorSubject<DisplaySettings>({
    fullscreen: false
  });

  public get settings(): DisplaySettings {
    return this.settingsSubject.getValue();
  }

  public set settings(settings: DisplaySettings) {
    this.settingsSubject.next(settings);
  }

  public settingsChange(): Observable<DisplaySettings> {
    return this.settingsSubject.asObservable().pipe(distinctUntilChanged());
  }

  public setPartial(partialSettings: Partial<DisplaySettings>): void {
    this.settingsSubject.next({
      ...this.settings,
      ...partialSettings
    });
  }
}
