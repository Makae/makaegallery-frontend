import {Injectable} from '@angular/core';
import {BasicAuth, HttpClientService} from "./http-client.service";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {distinctUntilChanged} from 'rxjs/operators';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {AuthStatus} from '../models/auth-status-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static STORAGE_KEY = 'BasicAuthHeader';

  private authStatusSubject = new BehaviorSubject<AuthStatus>({})

  public constructor(private httpClientService: HttpClientService) {
    const basicAuthHeader = AuthService.getStoredBasicAuthHeader();
    if (basicAuthHeader) {
      this.httpClientService.setBasicAuthHeaders(basicAuthHeader);
    }

    this.httpClientService.httpGet<boolean>(`auth/status`).subscribe({
      complete: () => {
        this.authStatusSubject.next({loggedIn: true});
      },
      error: (error: HttpErrorResponse) => {
        AuthService.clearStoredBasicAuthHeader();
        if (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden) {
          this.authStatusSubject.next({loggedIn: false});
        }
      }
    });
  }

  private static getStoredBasicAuthHeader(): BasicAuth | null {
    const stored = window.localStorage.getItem(AuthService.STORAGE_KEY);
    try {
      return JSON.parse(stored as string) as BasicAuth;
    } catch {
      return null;
    }
  }

  private static storeBasicAuthHeader(basicAuth: BasicAuth): void {
    // TODO: REMOVE THIS - IS ONLY for development
    // window.localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(basicAuth as BasicAuth));
  }

  private static clearStoredBasicAuthHeader(): void {
    window.localStorage.removeItem(AuthService.STORAGE_KEY)
  }

  public login(name: string, password: string): Observable<AuthStatus> {
    this.httpClientService.setBasicAuthHeaders({name, password});

    this.httpClientService.httpGet(
      `auth/status`
    ).subscribe({
      complete: () => {
        AuthService.storeBasicAuthHeader({name, password});
        this.authStatusSubject.next({loggedIn: true});
      },
      error: (response) => {
        AuthService.clearStoredBasicAuthHeader();
        if (response.status === HttpStatusCode.Unauthorized) {
          this.authStatusSubject.next({loggedIn: false});
        }
      }
    });
    return this.authStatusChange();
  }

  public authStatusChange(): Observable<AuthStatus> {
    return this.authStatusSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  public logout(): Observable<void> {
    this.httpClientService.clearBasicAuthHeaders();
    AuthService.clearStoredBasicAuthHeader();
    this.authStatusSubject.next({loggedIn: false})
    return EMPTY;
  }
}
