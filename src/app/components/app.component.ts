import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {DisplayService} from '../shared/services/display.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public showFullscreen = false;

  public constructor(
    private readonly displayService: DisplayService,
    private readonly router: Router
  ) {
    displayService.settingsChange().subscribe((settings) => {
      this.showFullscreen = settings.fullscreen;
    });

    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url.split('#')[0] !== '/' ) {
        this.showFullscreen = false;
      }
    })
  }

  public ngOnInit(): void {
  }

}
