import {Component, ElementRef, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form',
  template: 'Do not use FormComponent directly!',
  styleUrls: []
})
export class FormComponent {
  @ViewChild('form') public form?: ElementRef;

  public formGroup: FormGroup = new FormGroup({});

  protected getField(name: string): AbstractControl | null {
    return this.formGroup.get(name);
  }

  protected getFieldValue(name: string): string {
    return this.getField(name)?.value;
  }

  protected getTrimmedFieldValue(name: string): string {
    return this.getFieldValue(name)?.trim();
  }

  public focusField(fieldName: string): void {
    this.form?.nativeElement.querySelector(`[name="${fieldName}"]`)?.focus();
  }

  public getUndefinedIfEmpty(fieldName: string) {
    const value = this.getTrimmedFieldValue(fieldName);
    return value ? value : undefined;
  }
}
