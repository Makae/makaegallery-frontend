import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormComponent} from './form.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ElementRef} from '@angular/core';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent]
    })
      .compileComponents();
  });

  const fieldKey = 'testControl';

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      testControl: new FormControl('default-value', Validators.maxLength(15))
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return CorrectFieldValue', () => {
    let calledFocus = false;
    component.form = {
      nativeElement: {
        querySelector: () => ({
          focus: () => {
            calledFocus = true;
          }
        })
      }
    } as ElementRef;

    component.focusField(fieldKey);
    expect(calledFocus).toBeTrue();
  });

  it('should return undefined if empty', () => {
    component.formGroup.controls.testControl.setValue('');

    const result = component.getUndefinedIfEmpty('testControl');
    expect(result).toBeUndefined();
  });

  it('should return value if it is not empty', () => {
    component.formGroup.controls.testControl.setValue('test');

    const result = component.getUndefinedIfEmpty('testControl');
    expect(result).toEqual('test');
  });
});
