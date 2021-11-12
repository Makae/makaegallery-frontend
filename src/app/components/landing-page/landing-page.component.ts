import { Component, OnInit } from '@angular/core';
import {FormComponent} from '../../shared/components/form/form.component';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {requiredValidator} from '../../shared/input-validators';
import {LoginFormFields} from '../login/login-dialog/login-dialog.component';
import {Router} from '@angular/router';
import {DisplayService} from '../../shared/services/display.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent extends FormComponent implements OnInit {
  public readonly loginFormFieldsEnum = LoginFormFields;
  public isLoading = false;
  public showCredentialsError = false;
  public loggedIn = false;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly displayService: DisplayService
  ) {
    super();
    this.displayService.setPartial({fullscreen: true});
    this.authService.authStatusChange().subscribe(status => {
      this.loggedIn = !!status.loggedIn;
    })
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      [LoginFormFields.USER_NAME]: [undefined, {validators: [requiredValidator]}],
      [LoginFormFields.PASSWORD]: [undefined, {validators: [requiredValidator]}],
    });
  }

  public onSubmit(): void {
    this.isLoading = true;
    this.showCredentialsError = false;
    this.authService.login(
      this.getTrimmedFieldValue(LoginFormFields.USER_NAME),
      this.getTrimmedFieldValue(LoginFormFields.PASSWORD)
    ).subscribe((successful) => {
      this.isLoading = false;
      if (!successful) {
        this.showCredentialsError = true;
      } else {
        this.router.navigateByUrl('galleries');
      }

    });
  }

}
