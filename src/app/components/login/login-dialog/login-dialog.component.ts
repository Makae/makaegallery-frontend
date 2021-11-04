import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {requiredValidator} from '../../../shared/input-validators';
import {AuthService} from '../../../shared/services/auth.service';
import {FormComponent} from '../../../shared/components/form/form.component';

export enum LoginFormFields {
  USER_NAME = 'user_name',
  PASSWORD = 'password'
};

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent extends FormComponent implements OnInit {
  public readonly loginFormFieldsEnum = LoginFormFields;
  public isLoading = false;

  public constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {
    super();

  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      [LoginFormFields.USER_NAME]: [undefined, {validators: [requiredValidator]}],
      [LoginFormFields.PASSWORD]: [undefined, {validators: [requiredValidator]}],
    });
  }

  public onSubmit(): void {
      this.isLoading = true;
    this.authService.login(
      this.getTrimmedFieldValue(LoginFormFields.USER_NAME),
      this.getTrimmedFieldValue(LoginFormFields.PASSWORD)
    ).subscribe(() => {
      this.isLoading = false;
      this.dialogRef.close();
    });
  }


}
