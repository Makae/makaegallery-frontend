import {Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  @Input()
  public color: ThemePalette = 'primary';

  @Input()
  public diameter = 75;

  @Input()
  public mode: ProgressSpinnerMode = 'indeterminate';

  @Input()
  public strokeWidth = 5;

}
