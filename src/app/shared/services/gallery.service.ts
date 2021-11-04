import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {Observable} from "rxjs";
import {Gallery} from '../models/gallery-model';


@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  public constructor(private httpClientService: HttpClientService) {
  }

  public getGalleries(): Observable<Gallery[]> {
    return this.httpClientService.httpGet<Gallery[]>(`galleries`);
  }

  public getGallery(galleryId: string): Observable<Gallery> {
    return this.httpClientService.httpGet<Gallery>(`galleries/${galleryId}`);
  }
}
