import {Component, OnInit} from '@angular/core';
import {GalleryService} from '../../../shared/services/gallery.service';
import {Gallery} from '../../../shared/models/gallery-model';
import {AuthService} from '../../../shared/services/auth.service';
import {distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gallery-listing',
  templateUrl: './gallery-listing.component.html',
  styleUrls: ['./gallery-listing.component.scss']
})
export class GalleryListingComponent implements OnInit {
  public showLoginMessage = true;
  public galleries: Gallery[] = [];

  public constructor(
    private readonly authService: AuthService,
    private readonly galleryService: GalleryService,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.authService.authStatusChange().pipe(
      map(status => status.loggedIn),
      filter(loggedIn => loggedIn === true),
      distinctUntilChanged(),
      switchMap(() => this.galleryService.getGalleries())
    ).subscribe((galleries) => {
        this.showLoginMessage = false;
        this.galleries = galleries;
      }
    );
  }

  public goToGallery(galleryId: string): void {
    this.router.navigate(['gallery', galleryId]);
  }
}
