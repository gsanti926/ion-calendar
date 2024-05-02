import { Component, Input } from '@angular/core';
import { defaults } from '../config';

@Component({
  selector: 'ion-calendar-week',
  styleUrls: ['./calendar-week.component.scss'],
  template: `
    <ion-toolbar [class]="'week-toolbar '" no-border-top>
      <ul [class]="'week-title ' + color">
        <li *ngFor="let w of _displayWeekArray">{{ w }}</li>
      </ul>
    </ion-toolbar>
  `,
})
export class CalendarWeekComponent {
  _weekArray: string[] = defaults.WEEKS_FORMAT;
  _displayWeekArray: string[] = this._weekArray;
  _weekStart = 0;
  @Input()
  color: string | undefined = defaults.COLOR;
  constructor() {}
  @Input()
  set weekArray(value: string[] | undefined) {
    if (value && value.length === 7) {
      this._weekArray = [...value];
      this.adjustSort();
    }
  }

  @Input()
  set weekStart(value: number | undefined) {
    if (value === 0 || value === 1) {
      this._weekStart = value;
      this.adjustSort();
    }
  }

  adjustSort(): void {
    if (this._weekStart === 1) {
      const cacheWeekArray = [...this._weekArray] as any;
      cacheWeekArray.push(cacheWeekArray.shift());
      this._displayWeekArray = [...cacheWeekArray];
    } else if (this._weekStart === 0) {
      this._displayWeekArray = [...this._weekArray];
    }
  }
}
