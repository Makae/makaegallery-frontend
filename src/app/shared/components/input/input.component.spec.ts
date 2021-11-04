import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InputComponent} from './input.component';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatIconModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.formGroupRef = new FormGroup({
      testControl: new FormControl('default-value', Validators.maxLength(15))
    });
    component.formControlKey = 'testControl';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger onChange', () => {
    let changed = false;
    component.registerOnChange(() => {
      changed = true;
    });
    component.value = 'New value';
    expect(changed).toBe(true);
  });

  it('should trigger onChange via writeValue', () => {
    let changed = false;
    component.registerOnChange(() => {
      changed = true;
    });
    component.writeValue('New value');
    expect(changed).toBe(true);
  });

  it('should trigger onTouched', () => {
    let touched = false;
    component.registerOnTouched(() => {
      touched = true;
    });
    component.onBlur();
    expect(touched).toBe(true);
  });

  it('should set errors', () => {
    const control = component.formGroupRef.controls.testControl as AbstractControl;
    control.setValue('More then fifteen characters');
    expect(control.errors?.maxLength).not.toBeNull();
    expect(control.errors).toHaveSize(1);
  });

  it('should clear correctly', () => {
    const control = component.formGroupRef.controls.testControl as AbstractControl;
    control.setValue('More then fifteen characters');
    expect(control.errors?.maxLength).not.toBeNull();
    component.clear({
      stopImmediatePropagation: () => {
      }
    } as MouseEvent);
    expect(control.value).toBe(null);
    expect(control.errors).toBe(null);
  });

  it('should trigger focus when showing Options', () => {
    let focusCalled = false;
    component.inputField = {
      nativeElement: {
        focus: () => {
          focusCalled = true;
        }
      }
    };

    component.showOptions();
    expect(focusCalled).toBeTrue();

  });

  it('should focus if property set', () => {
    component.setFocus = true;
    let focusCalled = false;
    component.inputField = {
      nativeElement: {
        focus: () => {
          focusCalled = true;
        }
      }
    };
    component.ngAfterViewInit();

    expect(focusCalled).toBeTrue();
  });

  it('should not focus if property not set', () => {
    component.setFocus = false;
    let focusCalled = false;
    component.inputField = {
      nativeElement: {
        focus: () => {
          focusCalled = true;
        }
      }
    };
    component.ngAfterViewInit();

    expect(focusCalled).toBeFalse();
  });

  it('should filter values if value changed', () => {
    component.options = ['alpha', 'alpha-two', 'beta'];
    component.ngOnInit();
    let filteredOptions: string[] = [];
    component.filteredOptions.subscribe((options) => {
      filteredOptions = options;
    });
    component.formGroupRef.controls.testControl.setValue('alpha');
    expect(filteredOptions).toContain('alpha');
    expect(filteredOptions).toContain('alpha-two');
    expect(filteredOptions).not.toContain('beta');
  });

  it('should trigger onOptionChanged', () => {
    const inValue = 'value-to-be-set';
    let outValue = '';
    component.optionChanged.subscribe((value: string) => {
      outValue = value;
    });
    component.onOptionChanged(inValue);
    expect(inValue).toBe(outValue);
  });
});
