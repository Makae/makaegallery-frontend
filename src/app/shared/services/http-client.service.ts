import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {PropertyModel} from '../models/property-model';
import {AuthService} from './auth.service';

export interface BasicAuth {
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly basePath: string;
  private basicAuth?: BasicAuth;


  public constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.basePath = configService.config.backendUrl;
    if (!this.basePath.endsWith('/')) {
      this.basePath += '/';
    }
  }

  public setBasicAuthHeaders(basicAuth: BasicAuth) {
    this.basicAuth = basicAuth;
  }

  public clearBasicAuthHeaders() {
    this.basicAuth = undefined;
  }

  public httpGet<T>(path: string, params?: HttpParams): Observable<T> {
    return this.httpClient.get<T>(this.basePath + path, {
      params: params,
      headers: this.getBasicAuthHeaders()
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public httpPost<T>(path: string, body: any, params?: HttpParams, responseType?: string): Observable<T> {
    return this.httpClient.post<T>(this.basePath + path, body, {
      params: params,
      headers: this.getBasicAuthHeaders(),
      responseType
    } as PropertyModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public httpPostResponse(path: string, body: any, params?: HttpParams): Observable<Object> {
    return this.httpClient.post(this.basePath + path, body, {
      params: params,
      headers: this.getBasicAuthHeaders(),
      observe: 'response'
    } as PropertyModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public httpPut<T>(path: string, body: any, params?: HttpParams): Observable<T> {
    return this.httpClient.put<T>(this.basePath + path, body, {
      params: params,
      headers: this.getBasicAuthHeaders()
    });
  }

  public httpDelete<T>(path: string, params?: HttpParams): Observable<T> {
    return this.httpClient.delete<T>(this.basePath + path, {
      params: params,
      headers: this.getBasicAuthHeaders()
    });
  }

  private getBasicAuthHeaders(): HttpHeaders {
    const token = btoa(`${this.basicAuth?.name}:${this.basicAuth?.password}`);
    let headers = new HttpHeaders();
    if (this.basicAuth) {
      headers = headers.append(
        'Authorization',
        `Basic ${token}`
      );
    }
    return headers;
  }
}
