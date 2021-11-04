import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit {
  @ViewChild('inputField') public inputField?: ElementRef;

  @Input()
  public required = false;
  @Input()
  public formGroupRef: FormGroup = new FormGroup({});
  @Input()
  public label = '';
  @Input()
  public placeholder = '';
  @Input()
  public setFocus = false;
  @Input()
  public inputType = 'text';
  @Input()
  public formControlKey = '';
  @Input()
  public cssClass = '';
  @Input()
  public inputTabIndex = 0;

  public errors: string[] = [];
  private valueProperty?: string;

  public constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  public get value(): string | undefined {
    return this.valueProperty;
  }

  public set value(val) {
    if (val !== this.valueProperty) {
      this.valueProperty = val;
      this.onChange();
    }
  }

  private get field(): AbstractControl {
    return this.formGroupRef.controls[this.formControlKey];
  }

  public ngOnInit(): void {
  }

  public onChange(): void {
    this.propagateChange(this.value);
  }

  public writeValue(value: string | undefined): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  public registerOnChange(fn: (value: string | undefined) => void): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: (value: string | undefined) => void): void {
    this.propagateTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    // stub
  }

  public clear($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    this.field.reset(null, {emitEvent: true});
    this.field.setErrors(null, {emitEvent: true});
    this.field.updateValueAndValidity();
  }

  public onBlur(): void {
    this.errors = [];
    const errorData = this.field.errors;
    for (const errorKey in errorData) {
      if (errorData?.hasOwnProperty(errorKey)) {
        this.errors.push(errorData[errorKey]);
      }
    }
    this.propagateTouched(this.value);
  }

  public ngOnChanges(): void {
    this.field?.statusChanges.subscribe({
      next: () => this.onBlur()
    });
  }

  public ngAfterViewInit(): void {
    if (!this.setFocus) {
      return;
    }
    this.inputField?.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  private propagateChange: (value: string | undefined) => void = (value: string | undefined) => {
    // stub
  };

  private propagateTouched: (value: string | undefined) => void = (value: string | undefined) => {
    // stub
  };
}
