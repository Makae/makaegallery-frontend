import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {map} from 'rxjs/operators';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

  public loggedIn?: Observable<boolean>;

  public constructor(
    public authService: AuthService,
    public loginDialog: MatDialog,
    public router: Router
  ) {
  }


  public ngOnInit(): void {
    this.loggedIn = this.authService
      .authStatusChange()
      .pipe(
        map((authStatus) => !!authStatus.loggedIn)
      );
  }

  public onLoginClick(): void {
    this.loginDialog.open(LoginDialogComponent, {panelClass: 'spinner-context'});
  }

  public onLogoutClick(): void {
    this.authService.logout().subscribe({
      complete: () => {
        this.loginDialog.closeAll();
        this.router.navigateByUrl('/');
      }
    });
  }
}
