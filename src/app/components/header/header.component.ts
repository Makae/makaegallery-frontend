import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input()
  public cssClass = '';
  public showBackToGalleries = false;

  public constructor(
    private router: Router
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart)
    ).subscribe((event) => {
      this.setShowBackToGalleriesBasedOnUrl(event.url);
    });

    this.setShowBackToGalleriesBasedOnUrl(router.url);
  }

  private setShowBackToGalleriesBasedOnUrl(url: string): void {
    this.showBackToGalleries = url.startsWith('/gallery/');
  }
}
