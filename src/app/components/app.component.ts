import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loggedIn?: Observable<boolean>;

  public constructor(
    public authService: AuthService
  ) {

  }

  public ngOnInit(): void {
    this.loggedIn = this.authService
      .authStatusChange()
      .pipe(
        map((authStatus) => !!authStatus.loggedIn)
      );
  }

}
