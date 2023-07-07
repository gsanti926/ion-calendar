import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, Component, Input, forwardRef, EventEmitter, Output, ViewChild, HostBinding, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as i1 from '@ionic/angular';
import { IonContent, IonicModule, ModalController } from '@ionic/angular';
import moment from 'moment';
import * as i1$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i6 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

class CalendarMonth {
}
class CalendarResult {
}
class CalendarComponentMonthChange {
}

const defaults = {
    DATE_FORMAT: 'YYYY-MM-DD',
    COLOR: 'primary',
    WEEKS_FORMAT: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    MONTH_FORMAT: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
};
const pickModes = {
    SINGLE: 'single',
    RANGE: 'range',
    MULTI: 'multi'
};

const DEFAULT_CALENDAR_OPTIONS = new InjectionToken('DEFAULT_CALENDAR_MODAL_OPTIONS');

const isBoolean = (input) => input === true || input === false;
class CalendarService {
    constructor(defaultOpts) {
        this.defaultOpts = defaultOpts;
    }
    get DEFAULT_STEP() {
        return 12;
    }
    safeOpt(calendarOptions = {}) {
        const _disableWeeks = [];
        const _daysConfig = [];
        let { from = new Date(), to = 0, weekStart = 0, step = this.DEFAULT_STEP, id = '', cssClass = '', closeLabel = 'CANCEL', doneLabel = 'DONE', monthFormat = 'MMM YYYY', title = 'CALENDAR', defaultTitle = '', defaultSubtitle = '', autoDone = false, canBackwardsSelected = false, closeIcon = false, doneIcon = false, showYearPicker = false, isSaveHistory = false, pickMode = pickModes.SINGLE, color = defaults.COLOR, weekdays = defaults.WEEKS_FORMAT, daysConfig = _daysConfig, disableWeeks = _disableWeeks, showAdjacentMonthDay = true, defaultEndDateToStartDate = false, clearLabel = null, maxMultiDates = null } = Object.assign(Object.assign({}, this.defaultOpts), calendarOptions);
        return {
            id,
            from,
            to,
            pickMode,
            autoDone,
            color,
            cssClass,
            weekStart,
            closeLabel,
            closeIcon,
            doneLabel,
            doneIcon,
            canBackwardsSelected,
            isSaveHistory,
            disableWeeks,
            monthFormat,
            title,
            weekdays,
            daysConfig,
            step,
            showYearPicker,
            defaultTitle,
            defaultSubtitle,
            defaultScrollTo: calendarOptions.defaultScrollTo || from,
            defaultDate: calendarOptions.defaultDate || null,
            defaultDates: calendarOptions.defaultDates || null,
            defaultDateRange: calendarOptions.defaultDateRange || null,
            showAdjacentMonthDay,
            defaultEndDateToStartDate,
            clearLabel,
            maxMultiDates
        };
    }
    createOriginalCalendar(time) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstWeek = new Date(year, month, 1).getDay();
        const howManyDays = moment(time).daysInMonth();
        return {
            year,
            month,
            firstWeek,
            howManyDays,
            time: new Date(year, month, 1).getTime(),
            date: new Date(time),
        };
    }
    findDayConfig(day, opt) {
        if (!opt.daysConfig && opt.daysConfig.length <= 0)
            return null;
        return opt.daysConfig.find((n) => day.isSame(n.date, 'day'));
    }
    createCalendarDay(time, opt, month) {
        var _a;
        let _time = moment(time);
        let date = moment(time);
        let isToday = moment().isSame(_time, 'days');
        let dayConfig = this.findDayConfig(_time, opt);
        let _rangeBeg = moment(opt.from).valueOf();
        let _rangeEnd = moment(opt.to).valueOf();
        let isBetween = true;
        let disableWee = ((_a = opt === null || opt === void 0 ? void 0 : opt.disableWeeks) === null || _a === void 0 ? void 0 : _a.indexOf(_time.toDate().getDay())) !== -1;
        if (_rangeBeg > 0 && _rangeEnd > 0) {
            if (!opt.canBackwardsSelected) {
                isBetween = !_time.isBetween(_rangeBeg, _rangeEnd, 'days', '[]');
            }
            else {
                isBetween = moment(_time).isBefore(_rangeBeg) ? false : isBetween;
            }
        }
        else if (_rangeBeg > 0 && _rangeEnd === 0) {
            if (!opt.canBackwardsSelected) {
                let _addTime = _time.add(1, 'day');
                isBetween = !_addTime.isAfter(_rangeBeg);
            }
            else {
                isBetween = false;
            }
        }
        let _disable = false;
        if (dayConfig && isBoolean(dayConfig.disable)) {
            _disable = dayConfig.disable;
        }
        else {
            _disable = disableWee || isBetween;
        }
        let title = new Date(time).getDate().toString();
        if (dayConfig && dayConfig.title) {
            title = dayConfig.title;
        }
        else if (opt.defaultTitle) {
            title = opt.defaultTitle;
        }
        let subTitle = '';
        if (dayConfig && dayConfig.subTitle) {
            subTitle = dayConfig.subTitle;
        }
        else if (opt.defaultSubtitle) {
            subTitle = opt.defaultSubtitle;
        }
        return {
            time,
            isToday,
            title,
            subTitle,
            selected: false,
            isLastMonth: date.month() < (month ? month : 0),
            isNextMonth: date.month() > (month ? month : 0),
            marked: dayConfig ? dayConfig.marked || false : false,
            cssClass: dayConfig ? dayConfig.cssClass || '' : '',
            disable: _disable,
            isFirst: date.date() === 1,
            isLast: date.date() === date.daysInMonth(),
        };
    }
    createCalendarMonth(original, opt) {
        let days = new Array(6).fill(null);
        let len = original.howManyDays;
        for (let i = original.firstWeek; i < len + original.firstWeek; i++) {
            let itemTime = new Date(original.year, original.month, i - original.firstWeek + 1).getTime();
            days[i] = this.createCalendarDay(itemTime, opt);
        }
        let weekStart = opt.weekStart;
        if (weekStart === 1) {
            if (days[0] === null) {
                days.shift();
            }
            else {
                days.unshift(...new Array(6).fill(null));
            }
        }
        if (opt.showAdjacentMonthDay) {
            const _booleanMap = days.map(e => !!e);
            const thisMonth = moment(original.time).month();
            let startOffsetIndex = _booleanMap.indexOf(true) - 1;
            let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
            for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
                const dayBefore = moment(days[startOffsetIndex + 1].time)
                    .clone()
                    .subtract(1, 'd');
                days[startOffsetIndex] = this.createCalendarDay(dayBefore.valueOf(), opt, thisMonth);
            }
            if (!(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])) {
                for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
                    const dayAfter = moment(days[endOffsetIndex - 1].time)
                        .clone()
                        .add(1, 'd');
                    days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);
                }
            }
        }
        return {
            days,
            original: original,
        };
    }
    createMonthsByPeriod(startTime, monthsNum, opt) {
        let _array = [];
        let _start = new Date(startTime);
        let _startMonth = new Date(_start.getFullYear(), _start.getMonth(), 1).getTime();
        for (let i = 0; i < monthsNum; i++) {
            let time = moment(_startMonth)
                .add(i, 'M')
                .valueOf();
            let originalCalendar = this.createOriginalCalendar(time);
            _array.push(this.createCalendarMonth(originalCalendar, opt));
        }
        return _array;
    }
    wrapResult(original, pickMode) {
        let result;
        switch (pickMode) {
            case pickModes.SINGLE:
                result = this.multiFormat(original[0].time);
                break;
            case pickModes.RANGE:
                result = {
                    from: this.multiFormat(original[0].time),
                    to: this.multiFormat((original[1] || original[0]).time),
                };
                break;
            case pickModes.MULTI:
                result = original.map(e => this.multiFormat(e.time));
                break;
            default:
                result = original;
        }
        return result;
    }
    multiFormat(time) {
        const _moment = moment(time);
        return {
            time: _moment.valueOf(),
            unix: _moment.unix(),
            dateObj: _moment.toDate(),
            string: _moment.format(defaults.DATE_FORMAT),
            years: _moment.year(),
            months: _moment.month() + 1,
            date: _moment.date(),
        };
    }
}
CalendarService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarService, deps: [{ token: DEFAULT_CALENDAR_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CalendarService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DEFAULT_CALENDAR_OPTIONS]
                }] }]; } });

class CalendarWeekComponent {
    constructor() {
        this._weekArray = defaults.WEEKS_FORMAT;
        this._displayWeekArray = this._weekArray;
        this._weekStart = 0;
        this.color = defaults.COLOR;
    }
    set weekArray(value) {
        if (value && value.length === 7) {
            this._weekArray = [...value];
            this.adjustSort();
        }
    }
    set weekStart(value) {
        if (value === 0 || value === 1) {
            this._weekStart = value;
            this.adjustSort();
        }
    }
    adjustSort() {
        if (this._weekStart === 1) {
            const cacheWeekArray = [...this._weekArray];
            cacheWeekArray.push(cacheWeekArray.shift());
            this._displayWeekArray = [...cacheWeekArray];
        }
        else if (this._weekStart === 0) {
            this._displayWeekArray = [...this._weekArray];
        }
    }
}
CalendarWeekComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarWeekComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarWeekComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: CalendarWeekComponent, selector: "ion-calendar-week", inputs: { color: "color", weekArray: "weekArray", weekStart: "weekStart" }, ngImport: i0, template: `
    <ion-toolbar [class]="'week-toolbar '" no-border-top>
      <ul [class]="'week-title ' + color">
        <li *ngFor="let w of _displayWeekArray">{{ w }}</li>
      </ul>
    </ion-toolbar>
  `, isInline: true, styles: [":host .toolbar-background-md,:host .toolbar-background-ios{background:transparent}:host .week-toolbar{--padding-start: 0;--padding-end: 0;--padding-bottom: 0;--padding-top: 0}:host .week-toolbar.primary{--background: var(--ion-color-primary)}:host .week-toolbar.secondary{--background: var(--ion-color-secondary)}:host .week-toolbar.danger{--background: var(--ion-color-danger)}:host .week-toolbar.dark{--background: var(--ion-color-dark)}:host .week-toolbar.light{--background: var(--ion-color-light)}:host .week-toolbar.transparent{--background: transparent}:host .week-toolbar.toolbar-md{min-height:44px}:host .week-title{margin:0;height:44px;width:100%;padding:15px 0;font-size:.9em}:host .week-title.light,:host .week-title.transparent{color:#9e9e9e}:host .week-title li{list-style-type:none;display:block;float:left;width:14%;text-align:center;font-weight:bold}:host .week-title li:nth-of-type(7n),:host .week-title li:nth-of-type(7n + 1){width:15%}\n"], components: [{ type: i1.IonToolbar, selector: "ion-toolbar", inputs: ["color", "mode"] }], directives: [{ type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarWeekComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ion-calendar-week',
                    styleUrls: ['./calendar-week.component.scss'],
                    template: `
    <ion-toolbar [class]="'week-toolbar '" no-border-top>
      <ul [class]="'week-title ' + color">
        <li *ngFor="let w of _displayWeekArray">{{ w }}</li>
      </ul>
    </ion-toolbar>
  `,
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { color: [{
                type: Input
            }], weekArray: [{
                type: Input
            }], weekStart: [{
                type: Input
            }] } });

const MONTH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonthComponent),
    multi: true,
};
class MonthComponent {
    constructor(ref) {
        this.ref = ref;
        this.readonly = false;
        this.color = defaults.COLOR;
        this.change = new EventEmitter();
        this.select = new EventEmitter();
        this.selectStart = new EventEmitter();
        this.selectEnd = new EventEmitter();
        this._date = [null, null];
        this._isInit = false;
        this.DAY_DATE_FORMAT = 'MMMM dd, yyyy';
    }
    get _isRange() {
        return this.pickMode === pickModes.RANGE;
    }
    ngAfterViewInit() {
        this._isInit = true;
    }
    get value() {
        return this._date;
    }
    writeValue(obj) {
        if (Array.isArray(obj)) {
            this._date = obj;
        }
    }
    registerOnChange(fn) {
        this._onChanged = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    trackByTime(index, item) {
        return item ? item.time : index;
    }
    isEndSelection(day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[1] === null) {
            return false;
        }
        return this._date[1].time === day.time;
    }
    getDayLabel(day) {
        return new Date(day.time);
    }
    isBetween(day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE || !this._isInit) {
            return false;
        }
        if (this._date[0] === null || this._date[1] === null) {
            return false;
        }
        const start = this._date[0].time;
        const end = this._date[1].time;
        return day.time < end && day.time > start;
    }
    isStartSelection(day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[0] === null) {
            return false;
        }
        return this._date[0].time === day.time && this._date[1] !== null;
    }
    isSelected(time) {
        if (Array.isArray(this._date)) {
            if (this.pickMode !== pickModes.MULTI) {
                if (this._date[0] !== null) {
                    return time === this._date[0].time;
                }
                if (this._date[1] !== null) {
                    return time === this._date[1].time;
                }
            }
            else {
                return this._date.findIndex(e => e !== null && e.time === time) !== -1;
            }
        }
        else {
            return false;
        }
    }
    onSelected(item) {
        if (this.readonly)
            return;
        item.selected = true;
        this.select.emit(item);
        if (this.pickMode === pickModes.SINGLE) {
            this._date[0] = item;
            const emitValue = this._date;
            this.change.emit(emitValue);
            return;
        }
        if (this.pickMode === pickModes.RANGE) {
            if (this._date[0] === null) {
                this._date[0] = item;
                this.selectStart.emit(item);
            }
            else if (this._date[1] === null) {
                if (this._date[0].time < item.time) {
                    this._date[1] = item;
                    this.selectEnd.emit(item);
                }
                else {
                    this._date[1] = this._date[0];
                    this.selectEnd.emit(this._date[0]);
                    this._date[0] = item;
                    this.selectStart.emit(item);
                }
                // Ensure if the user has selected a date range, when a user interacts with another date on the calendar the range will reset.
                // } else if (this._date[0].time > item.time) {
                //   this._date[0] = item;
                //   this.selectStart.emit(item);
                // } else if (this._date[1].time < item.time) {
                //   this._date[1] = item;
                //   this.selectEnd.emit(item);
            }
            else {
                this._date[0] = item;
                this.selectStart.emit(item);
                this._date[1] = null;
            }
            const emitValue = this._date;
            this.change.emit(emitValue);
            return;
        }
        if (this.pickMode === pickModes.MULTI) {
            const index = this._date.findIndex(e => e !== null && e.time === item.time);
            if (index === -1) {
                if ((this.maxMultiDates && this._date.length < this.maxMultiDates) || !this.maxMultiDates) {
                    this._date.push(item);
                }
            }
            else {
                this._date.splice(index, 1);
            }
            const emitValue = this._date.filter(e => e !== null);
            this.change.emit(emitValue);
        }
    }
}
MonthComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: MonthComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MonthComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: MonthComponent, selector: "ion-calendar-month", inputs: { month: "month", pickMode: "pickMode", isSaveHistory: "isSaveHistory", id: "id", readonly: "readonly", color: "color", maxMultiDates: "maxMultiDates" }, outputs: { change: "change", select: "select", selectStart: "selectStart", selectEnd: "selectEnd" }, providers: [MONTH_VALUE_ACCESSOR], ngImport: i0, template: `
    <div [class]="color">
      <ng-template [ngIf]="!_isRange" [ngIfElse]="rangeBox">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month?.days" [ngForTrackBy]="trackByTime">
            <div class="days">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable"
                        [attr.aria-label]="getDayLabel(day) | date:DAY_DATE_FORMAT">
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>

      <ng-template #rangeBox>
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days"
                 [class.startSelection]="isStartSelection(day)"
                 [class.endSelection]="isEndSelection(day)"
                 [class.is-first-wrap]="day?.isFirst"
                 [class.is-last-wrap]="day?.isLast"
                 [class.between]="isBetween(day)">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.is-first]="day.isFirst"
                        [class.is-last]="day.isLast"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>

            </div>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `, isInline: true, styles: [":host{display:inline-block;width:100%}:host .days-box{padding:.5rem}:host .days:nth-of-type(7n),:host .days:nth-of-type(7n + 1){width:15%}:host .days{width:14%;float:left;text-align:center;height:36px;margin-bottom:5px}:host .days .marked p{font-weight:500}:host .days .on-selected{border:none}:host .days .on-selected p{font-size:1.3em}:host button.days-btn{border-radius:36px;width:36px;display:block;margin:0 auto;padding:0;height:36px;background-color:transparent;position:relative;z-index:2;outline:0}:host button.days-btn p{margin:0;font-size:1.2em;color:#333;text-align:center}:host button.days-btn[disabled] p{color:#00000040}:host button.days-btn.on-selected small{transition:bottom .3s;bottom:-14px}:host button.days-btn small{overflow:hidden;display:block;left:0;right:0;bottom:-5px;position:absolute;z-index:1;text-align:center;font-weight:200}:host .primary button.days-btn small,:host .primary .days .marked p,:host .primary .days .today p{color:var(--ion-color-primary)}:host .primary .days .today p{font-weight:700}:host .primary .days .today.on-selected p,:host .primary .days .marked.on-selected p{color:#fff}:host .primary .days .on-selected,:host .primary .startSelection button.days-btn,:host .primary .endSelection button.days-btn{background-color:var(--ion-color-primary);color:#fff}:host .primary .startSelection{position:relative}:host .primary .startSelection:before,:host .primary .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .primary .startSelection:before{background-color:var(--ion-color-primary)}:host .primary .startSelection:after{background-color:#fff;opacity:.25}:host .primary .endSelection{position:relative}:host .primary .endSelection:before,:host .primary .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .primary .endSelection:before{background-color:var(--ion-color-primary)}:host .primary .endSelection:after{background-color:#fff;opacity:.25}:host .primary .startSelection.endSelection:after{background-color:transparent}:host .primary .startSelection button.days-btn{border-radius:50%}:host .primary .between button.days-btn{background-color:var(--ion-color-primary);width:100%;border-radius:0;position:relative}:host .primary .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .primary .between button.days-btn p{color:#fff}:host .primary .endSelection button.days-btn{border-radius:50%}:host .primary .endSelection button.days-btn p{color:#fff}:host .primary .days.startSelection:nth-child(7n):before,:host .primary .days.between:nth-child(7n) button.days-btn,:host .primary button.days-btn.is-last{border-radius:0 36px 36px 0}:host .primary .days.startSelection:nth-child(7n):before.on-selected,:host .primary .days.between:nth-child(7n) button.days-btn.on-selected,:host .primary button.days-btn.is-last.on-selected{border-radius:50%}:host .primary .days.endSelection:nth-child(7n+1):before,:host .primary .days.between:nth-child(7n+1) button.days-btn,:host .primary .days.between.is-first-wrap button.days-btn.is-first,:host .primary button.days-btn.is-first{border-radius:36px 0 0 36px}:host .primary .startSelection button.days-btn.is-first,:host .primary .endSelection button.days-btn.is-first,:host .primary button.days-btn.is-first.on-selected,:host .primary button.days-btn.is-last.on-selected,:host .primary .startSelection button.days-btn.is-last,:host .primary .endSelection button.days-btn.is-last{border-radius:50%}:host .primary .startSelection.is-last-wrap:before,:host .primary .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .primary .endSelection.is-first-wrap:before,:host .primary .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .primary .days .on-selected p{color:#fff}:host .primary .startSelection button.days-btn,:host .primary .endSelection button.days-btn,:host .primary .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .primary .startSelection.endSelection:before{--ion-color-primary: transparent}:host .secondary button.days-btn small,:host .secondary .days .marked p,:host .secondary .days .today p{color:var(--ion-color-secondary)}:host .secondary .days .today p{font-weight:700}:host .secondary .days .today.on-selected p,:host .secondary .days .marked.on-selected p{color:#fff}:host .secondary .days .on-selected,:host .secondary .startSelection button.days-btn,:host .secondary .endSelection button.days-btn{background-color:var(--ion-color-secondary);color:#fff}:host .secondary .startSelection{position:relative}:host .secondary .startSelection:before,:host .secondary .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .secondary .startSelection:before{background-color:var(--ion-color-secondary)}:host .secondary .startSelection:after{background-color:#fff;opacity:.25}:host .secondary .endSelection{position:relative}:host .secondary .endSelection:before,:host .secondary .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .secondary .endSelection:before{background-color:var(--ion-color-secondary)}:host .secondary .endSelection:after{background-color:#fff;opacity:.25}:host .secondary .startSelection.endSelection:after{background-color:transparent}:host .secondary .startSelection button.days-btn{border-radius:50%}:host .secondary .between button.days-btn{background-color:var(--ion-color-secondary);width:100%;border-radius:0;position:relative}:host .secondary .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .secondary .between button.days-btn p{color:#fff}:host .secondary .endSelection button.days-btn{border-radius:50%}:host .secondary .endSelection button.days-btn p{color:#fff}:host .secondary .days.startSelection:nth-child(7n):before,:host .secondary .days.between:nth-child(7n) button.days-btn,:host .secondary button.days-btn.is-last{border-radius:0 36px 36px 0}:host .secondary .days.startSelection:nth-child(7n):before.on-selected,:host .secondary .days.between:nth-child(7n) button.days-btn.on-selected,:host .secondary button.days-btn.is-last.on-selected{border-radius:50%}:host .secondary .days.endSelection:nth-child(7n+1):before,:host .secondary .days.between:nth-child(7n+1) button.days-btn,:host .secondary .days.between.is-first-wrap button.days-btn.is-first,:host .secondary button.days-btn.is-first{border-radius:36px 0 0 36px}:host .secondary .startSelection button.days-btn.is-first,:host .secondary .endSelection button.days-btn.is-first,:host .secondary button.days-btn.is-first.on-selected,:host .secondary button.days-btn.is-last.on-selected,:host .secondary .startSelection button.days-btn.is-last,:host .secondary .endSelection button.days-btn.is-last{border-radius:50%}:host .secondary .startSelection.is-last-wrap:before,:host .secondary .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .secondary .endSelection.is-first-wrap:before,:host .secondary .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .secondary .days .on-selected p{color:#fff}:host .secondary .startSelection button.days-btn,:host .secondary .endSelection button.days-btn,:host .secondary .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .secondary .startSelection.endSelection:before{--ion-color-primary: transparent}:host .danger button.days-btn small,:host .danger .days .marked p,:host .danger .days .today p{color:var(--ion-color-danger)}:host .danger .days .today p{font-weight:700}:host .danger .days .today.on-selected p,:host .danger .days .marked.on-selected p{color:#fff}:host .danger .days .on-selected,:host .danger .startSelection button.days-btn,:host .danger .endSelection button.days-btn{background-color:var(--ion-color-danger);color:#fff}:host .danger .startSelection{position:relative}:host .danger .startSelection:before,:host .danger .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .danger .startSelection:before{background-color:var(--ion-color-danger)}:host .danger .startSelection:after{background-color:#fff;opacity:.25}:host .danger .endSelection{position:relative}:host .danger .endSelection:before,:host .danger .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .danger .endSelection:before{background-color:var(--ion-color-danger)}:host .danger .endSelection:after{background-color:#fff;opacity:.25}:host .danger .startSelection.endSelection:after{background-color:transparent}:host .danger .startSelection button.days-btn{border-radius:50%}:host .danger .between button.days-btn{background-color:var(--ion-color-danger);width:100%;border-radius:0;position:relative}:host .danger .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .danger .between button.days-btn p{color:#fff}:host .danger .endSelection button.days-btn{border-radius:50%}:host .danger .endSelection button.days-btn p{color:#fff}:host .danger .days.startSelection:nth-child(7n):before,:host .danger .days.between:nth-child(7n) button.days-btn,:host .danger button.days-btn.is-last{border-radius:0 36px 36px 0}:host .danger .days.startSelection:nth-child(7n):before.on-selected,:host .danger .days.between:nth-child(7n) button.days-btn.on-selected,:host .danger button.days-btn.is-last.on-selected{border-radius:50%}:host .danger .days.endSelection:nth-child(7n+1):before,:host .danger .days.between:nth-child(7n+1) button.days-btn,:host .danger .days.between.is-first-wrap button.days-btn.is-first,:host .danger button.days-btn.is-first{border-radius:36px 0 0 36px}:host .danger .startSelection button.days-btn.is-first,:host .danger .endSelection button.days-btn.is-first,:host .danger button.days-btn.is-first.on-selected,:host .danger button.days-btn.is-last.on-selected,:host .danger .startSelection button.days-btn.is-last,:host .danger .endSelection button.days-btn.is-last{border-radius:50%}:host .danger .startSelection.is-last-wrap:before,:host .danger .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .danger .endSelection.is-first-wrap:before,:host .danger .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .danger .days .on-selected p{color:#fff}:host .danger .startSelection button.days-btn,:host .danger .endSelection button.days-btn,:host .danger .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .danger .startSelection.endSelection:before{--ion-color-primary: transparent}:host .dark button.days-btn small,:host .dark .days .marked p,:host .dark .days .today p{color:var(--ion-color-dark)}:host .dark .days .today p{font-weight:700}:host .dark .days .today.on-selected p,:host .dark .days .marked.on-selected p{color:#fff}:host .dark .days .on-selected,:host .dark .startSelection button.days-btn,:host .dark .endSelection button.days-btn{background-color:var(--ion-color-dark);color:#fff}:host .dark .startSelection{position:relative}:host .dark .startSelection:before,:host .dark .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .dark .startSelection:before{background-color:var(--ion-color-dark)}:host .dark .startSelection:after{background-color:#fff;opacity:.25}:host .dark .endSelection{position:relative}:host .dark .endSelection:before,:host .dark .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .dark .endSelection:before{background-color:var(--ion-color-dark)}:host .dark .endSelection:after{background-color:#fff;opacity:.25}:host .dark .startSelection.endSelection:after{background-color:transparent}:host .dark .startSelection button.days-btn{border-radius:50%}:host .dark .between button.days-btn{background-color:var(--ion-color-dark);width:100%;border-radius:0;position:relative}:host .dark .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .dark .between button.days-btn p{color:#fff}:host .dark .endSelection button.days-btn{border-radius:50%}:host .dark .endSelection button.days-btn p{color:#fff}:host .dark .days.startSelection:nth-child(7n):before,:host .dark .days.between:nth-child(7n) button.days-btn,:host .dark button.days-btn.is-last{border-radius:0 36px 36px 0}:host .dark .days.startSelection:nth-child(7n):before.on-selected,:host .dark .days.between:nth-child(7n) button.days-btn.on-selected,:host .dark button.days-btn.is-last.on-selected{border-radius:50%}:host .dark .days.endSelection:nth-child(7n+1):before,:host .dark .days.between:nth-child(7n+1) button.days-btn,:host .dark .days.between.is-first-wrap button.days-btn.is-first,:host .dark button.days-btn.is-first{border-radius:36px 0 0 36px}:host .dark .startSelection button.days-btn.is-first,:host .dark .endSelection button.days-btn.is-first,:host .dark button.days-btn.is-first.on-selected,:host .dark button.days-btn.is-last.on-selected,:host .dark .startSelection button.days-btn.is-last,:host .dark .endSelection button.days-btn.is-last{border-radius:50%}:host .dark .startSelection.is-last-wrap:before,:host .dark .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .dark .endSelection.is-first-wrap:before,:host .dark .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .dark .days .on-selected p{color:#fff}:host .dark .startSelection button.days-btn,:host .dark .endSelection button.days-btn,:host .dark .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .dark .startSelection.endSelection:before{--ion-color-primary: transparent}:host .light button.days-btn small,:host .light .days .marked p,:host .light .days .today p{color:var(--ion-color-light)}:host .light .days .today p{font-weight:700}:host .light .days .today.on-selected p,:host .light .days .marked.on-selected p{color:#a0a0a0}:host .light .days .on-selected,:host .light .startSelection button.days-btn,:host .light .endSelection button.days-btn{background-color:var(--ion-color-light);color:#a0a0a0}:host .light .startSelection{position:relative}:host .light .startSelection:before,:host .light .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .light .startSelection:before{background-color:var(--ion-color-light)}:host .light .startSelection:after{background-color:#fff;opacity:.25}:host .light .endSelection{position:relative}:host .light .endSelection:before,:host .light .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .light .endSelection:before{background-color:var(--ion-color-light)}:host .light .endSelection:after{background-color:#fff;opacity:.25}:host .light .startSelection.endSelection:after{background-color:transparent}:host .light .startSelection button.days-btn{border-radius:50%}:host .light .between button.days-btn{background-color:var(--ion-color-light);width:100%;border-radius:0;position:relative}:host .light .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .light .between button.days-btn p{color:#a0a0a0}:host .light .endSelection button.days-btn{border-radius:50%}:host .light .endSelection button.days-btn p{color:#a0a0a0}:host .light .days.startSelection:nth-child(7n):before,:host .light .days.between:nth-child(7n) button.days-btn,:host .light button.days-btn.is-last{border-radius:0 36px 36px 0}:host .light .days.startSelection:nth-child(7n):before.on-selected,:host .light .days.between:nth-child(7n) button.days-btn.on-selected,:host .light button.days-btn.is-last.on-selected{border-radius:50%}:host .light .days.endSelection:nth-child(7n+1):before,:host .light .days.between:nth-child(7n+1) button.days-btn,:host .light .days.between.is-first-wrap button.days-btn.is-first,:host .light button.days-btn.is-first{border-radius:36px 0 0 36px}:host .light .startSelection button.days-btn.is-first,:host .light .endSelection button.days-btn.is-first,:host .light button.days-btn.is-first.on-selected,:host .light button.days-btn.is-last.on-selected,:host .light .startSelection button.days-btn.is-last,:host .light .endSelection button.days-btn.is-last{border-radius:50%}:host .light .startSelection.is-last-wrap:before,:host .light .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .light .endSelection.is-first-wrap:before,:host .light .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .light .days .on-selected p{color:#a0a0a0}:host .light .startSelection button.days-btn,:host .light .endSelection button.days-btn,:host .light .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .light .startSelection.endSelection:before{--ion-color-primary: transparent}:host .light .days .today p{color:#565656}:host .cal-color .days .today p{font-weight:700}:host .cal-color .days .today.on-selected p,:host .cal-color .days .marked.on-selected p{color:#fff}:host .cal-color .days .on-selected,:host .cal-color .startSelection button.days-btn,:host .cal-color .endSelection button.days-btn{color:#fff}:host .cal-color .startSelection{position:relative}:host .cal-color .startSelection:before,:host .cal-color .startSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;right:0;display:block}:host .cal-color .startSelection:after{background-color:#fff;opacity:.25}:host .cal-color .endSelection{position:relative}:host .cal-color .endSelection:before,:host .cal-color .endSelection:after{height:36px;width:50%;content:\"\";position:absolute;top:0;left:0;display:block}:host .cal-color .endSelection:after{background-color:#fff;opacity:.25}:host .cal-color .startSelection.endSelection:after{background-color:transparent}:host .cal-color .startSelection button.days-btn{border-radius:50%}:host .cal-color .between button.days-btn{width:100%;border-radius:0;position:relative}:host .cal-color .between button.days-btn:after{height:36px;width:100%;content:\"\";position:absolute;top:0;left:0;right:0;display:block;background-color:#fff;opacity:.25}:host .cal-color .between button.days-btn p{color:#fff}:host .cal-color .endSelection button.days-btn{border-radius:50%}:host .cal-color .endSelection button.days-btn p{color:#fff}:host .cal-color .days.startSelection:nth-child(7n):before,:host .cal-color .days.between:nth-child(7n) button.days-btn,:host .cal-color button.days-btn.is-last{border-radius:0 36px 36px 0}:host .cal-color .days.startSelection:nth-child(7n):before.on-selected,:host .cal-color .days.between:nth-child(7n) button.days-btn.on-selected,:host .cal-color button.days-btn.is-last.on-selected{border-radius:50%}:host .cal-color .days.endSelection:nth-child(7n+1):before,:host .cal-color .days.between:nth-child(7n+1) button.days-btn,:host .cal-color .days.between.is-first-wrap button.days-btn.is-first,:host .cal-color button.days-btn.is-first{border-radius:36px 0 0 36px}:host .cal-color .startSelection button.days-btn.is-first,:host .cal-color .endSelection button.days-btn.is-first,:host .cal-color button.days-btn.is-first.on-selected,:host .cal-color button.days-btn.is-last.on-selected,:host .cal-color .startSelection button.days-btn.is-last,:host .cal-color .endSelection button.days-btn.is-last{border-radius:50%}:host .cal-color .startSelection.is-last-wrap:before,:host .cal-color .startSelection.is-last-wrap:after{border-radius:0 36px 36px 0}:host .cal-color .endSelection.is-first-wrap:before,:host .cal-color .endSelection.is-first-wrap:after{border-radius:36px 0 0 36px}:host .cal-color .days .on-selected p{color:#fff}:host .cal-color .startSelection button.days-btn,:host .cal-color .endSelection button.days-btn,:host .cal-color .between button.days-btn{transition-property:background-color;transition-duration:.18s;transition-timing-function:ease-out}:host .cal-color .startSelection.endSelection:before{--ion-color-primary: transparent}body[data-dark-mode=true] :host button.days-btn p{color:#fff}body[data-dark-mode=true] :host button.days-btn[disabled] p{color:#ffffff80}\n"], directives: [{ type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], pipes: { "date": i1$1.DatePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: MonthComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ion-calendar-month',
                    providers: [MONTH_VALUE_ACCESSOR],
                    styleUrls: ['./month.component.scss'],
                    template: `
    <div [class]="color">
      <ng-template [ngIf]="!_isRange" [ngIfElse]="rangeBox">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month?.days" [ngForTrackBy]="trackByTime">
            <div class="days">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable"
                        [attr.aria-label]="getDayLabel(day) | date:DAY_DATE_FORMAT">
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>

      <ng-template #rangeBox>
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days"
                 [class.startSelection]="isStartSelection(day)"
                 [class.endSelection]="isEndSelection(day)"
                 [class.is-first-wrap]="day?.isFirst"
                 [class.is-last-wrap]="day?.isLast"
                 [class.between]="isBetween(day)">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.is-first]="day.isFirst"
                        [class.is-last]="day.isLast"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{ day.title }}</p>
                  <small *ngIf="day.subTitle">{{ day?.subTitle }}</small>
                </button>
              </ng-container>

            </div>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { month: [{
                type: Input
            }], pickMode: [{
                type: Input
            }], isSaveHistory: [{
                type: Input
            }], id: [{
                type: Input
            }], readonly: [{
                type: Input
            }], color: [{
                type: Input
            }], maxMultiDates: [{
                type: Input
            }], change: [{
                type: Output
            }], select: [{
                type: Output
            }], selectStart: [{
                type: Output
            }], selectEnd: [{
                type: Output
            }] } });

const NUM_OF_MONTHS_TO_CREATE = 3;
class CalendarModal {
    constructor(_renderer, _elementRef, modalCtrl, ref, calSvc) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.modalCtrl = modalCtrl;
        this.ref = ref;
        this.calSvc = calSvc;
        this.ionPage = true;
        this.datesTemp = [null, null];
        this._scrollLock = true;
    }
    ngOnInit() {
        this.init();
        this.initDefaultDate();
    }
    ngAfterViewInit() {
        this.findCssClass();
        if (this._d.canBackwardsSelected)
            this.backwardsMonth();
        this.scrollToDefaultDate();
    }
    init() {
        this._d = this.calSvc.safeOpt(this.options);
        this._d.showAdjacentMonthDay = false;
        this.step = this._d.step;
        if (this.step < this.calSvc.DEFAULT_STEP) {
            this.step = this.calSvc.DEFAULT_STEP;
        }
        this.calendarMonths = this.calSvc.createMonthsByPeriod(moment(this._d.from).valueOf(), this.findInitMonthNumber(this._d.defaultScrollTo) + this.step, this._d);
    }
    initDefaultDate() {
        const { pickMode, defaultDate, defaultDateRange, defaultDates } = this._d;
        switch (pickMode) {
            case pickModes.SINGLE:
                if (defaultDate) {
                    this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDate), this._d);
                }
                break;
            case pickModes.RANGE:
                if (defaultDateRange) {
                    if (defaultDateRange.from) {
                        this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.from), this._d);
                    }
                    if (defaultDateRange.to) {
                        this.datesTemp[1] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.to), this._d);
                    }
                }
                break;
            case pickModes.MULTI:
                if (defaultDates && defaultDates.length) {
                    this.datesTemp = defaultDates.map((e) => this.calSvc.createCalendarDay(this._getDayTime(e), this._d));
                }
                break;
            default:
                this.datesTemp = [null, null];
        }
    }
    findCssClass() {
        const { cssClass } = this._d;
        if (cssClass) {
            cssClass.split(' ').forEach((_class) => {
                if (_class.trim() !== '')
                    this._renderer.addClass(this._elementRef.nativeElement, _class);
            });
        }
    }
    onChange(data) {
        const { pickMode, autoDone } = this._d;
        this.datesTemp = data;
        this.ref.detectChanges();
        if (pickMode !== pickModes.MULTI && autoDone && this.canDone()) {
            this.done();
        }
        this.repaintDOM();
    }
    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
    done() {
        const { pickMode } = this._d;
        this.modalCtrl.dismiss(this.calSvc.wrapResult(this.datesTemp, pickMode), 'done');
    }
    canDone() {
        if (!Array.isArray(this.datesTemp)) {
            return false;
        }
        const { pickMode, defaultEndDateToStartDate } = this._d;
        switch (pickMode) {
            case pickModes.SINGLE:
                return !!(this.datesTemp[0] && this.datesTemp[0].time);
            case pickModes.RANGE:
                if (defaultEndDateToStartDate) {
                    return !!(this.datesTemp[0] && this.datesTemp[0].time);
                }
                return !!(this.datesTemp[0] && this.datesTemp[1]) && !!(this.datesTemp[0].time && this.datesTemp[1].time);
            case pickModes.MULTI:
                return this.datesTemp.length > 0 && this.datesTemp.every(e => !!e && !!e.time);
            default:
                return false;
        }
    }
    clear() {
        this.datesTemp = [null, null];
    }
    canClear() {
        return !!this.datesTemp[0];
    }
    nextMonth(event) {
        const len = this.calendarMonths.length;
        const final = this.calendarMonths[len - 1];
        const nextTime = moment(final.original.time)
            .add(1, 'M')
            .valueOf();
        const rangeEnd = this._d.to ? moment(this._d.to).subtract(1, 'M') : 0;
        if (len <= 0 || (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
            event.target.disabled = true;
            return;
        }
        this.calendarMonths.push(...this.calSvc.createMonthsByPeriod(nextTime, NUM_OF_MONTHS_TO_CREATE, this._d));
        event.target.complete();
        this.repaintDOM();
    }
    backwardsMonth() {
        const first = this.calendarMonths[0];
        if (first.original.time <= 0) {
            this._d.canBackwardsSelected = false;
            return;
        }
        const firstTime = (this.actualFirstTime = moment(first.original.time)
            .subtract(NUM_OF_MONTHS_TO_CREATE, 'M')
            .valueOf());
        this.calendarMonths.unshift(...this.calSvc.createMonthsByPeriod(firstTime, NUM_OF_MONTHS_TO_CREATE, this._d));
        this.ref.detectChanges();
        this.repaintDOM();
    }
    scrollToDate(date) {
        const defaultDateIndex = this.findInitMonthNumber(date);
        const monthElement = this.monthsEle.nativeElement.children[`month-${defaultDateIndex}`];
        const domElemReadyWaitTime = 300;
        setTimeout(() => {
            const defaultDateMonth = monthElement ? monthElement.offsetTop : 0;
            if (defaultDateIndex !== -1 && defaultDateMonth !== 0) {
                this.content.scrollByPoint(0, defaultDateMonth, 128);
            }
        }, domElemReadyWaitTime);
    }
    scrollToDefaultDate() {
        this.scrollToDate(this._d.defaultScrollTo);
    }
    onScroll($event) {
        if (!this._d.canBackwardsSelected)
            return;
        const { detail } = $event;
        if (detail.scrollTop <= 200 && detail.velocityY < 0 && this._scrollLock) {
            this.content.getScrollElement().then((scrollElem) => {
                this._scrollLock = !1;
                const heightBeforeMonthPrepend = scrollElem.scrollHeight;
                this.backwardsMonth();
                setTimeout(() => {
                    const heightAfterMonthPrepend = scrollElem.scrollHeight;
                    this.content.scrollByPoint(0, heightAfterMonthPrepend - heightBeforeMonthPrepend, 0).then(() => {
                        this._scrollLock = !0;
                    });
                }, 180);
            });
        }
    }
    /**
     * In some older Safari versions (observed at Mac's Safari 10.0), there is an issue where style updates to
     * shadowRoot descendants don't cause a browser repaint.
     * See for more details: https://github.com/Polymer/polymer/issues/4701
     */
    repaintDOM() {
        return this.content.getScrollElement().then((scrollElem) => {
            // Update scrollElem to ensure that height of the container changes as Months are appended/prepended
            scrollElem.style.zIndex = '2';
            scrollElem.style.zIndex = 'initial';
            // Update monthsEle to ensure selected state is reflected when tapping on a day
            this.monthsEle.nativeElement.style.zIndex = '2';
            this.monthsEle.nativeElement.style.zIndex = 'initial';
        });
    }
    findInitMonthNumber(date) {
        let startDate = this.actualFirstTime ? moment(this.actualFirstTime) : moment(this._d.from);
        const defaultScrollTo = moment(date);
        const isAfter = defaultScrollTo.isAfter(startDate);
        if (!isAfter)
            return -1;
        if (this.showYearPicker) {
            startDate = moment(new Date(this.year, 0, 1));
        }
        return defaultScrollTo.diff(startDate, 'month');
    }
    _getDayTime(date) {
        return moment(moment(date).format('YYYY-MM-DD')).valueOf();
    }
    _monthFormat(date) {
        return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'));
    }
    _getDayFormatted(data) {
        if (!data) {
            return null;
        }
        return moment(data.time).format('ddd, MMM Do');
    }
    trackByIndex(index, momentDate) {
        return momentDate.original ? momentDate.original.time : index;
    }
}
CalendarModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModal, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.ModalController }, { token: i0.ChangeDetectorRef }, { token: CalendarService }], target: i0.ɵɵFactoryTarget.Component });
CalendarModal.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: CalendarModal, selector: "ion-calendar-modal", inputs: { options: "options" }, host: { properties: { "class.ion-page": "this.ionPage" } }, viewQueries: [{ propertyName: "content", first: true, predicate: IonContent, descendants: true, static: true }, { propertyName: "monthsEle", first: true, predicate: ["months"], descendants: true, static: true }], ngImport: i0, template: `
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="secondary">
              <ion-button type='button' slot="icon-only" fill="clear" class="primary" (click)="onCancel()">
              <span *ngIf="_d.closeLabel !== '' && !_d.closeIcon">{{ _d.closeLabel }}</span>
              <ion-icon *ngIf="_d.closeIcon" name="close"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>{{ _d.title }}</ion-title>
      </ion-toolbar>

      <ng-content select="[sub-header]"></ng-content>

      <ion-row *ngIf="_d.pickMode === 'range'" lines="none" [class]="'dates-toolbar'" no-border>
        <ion-col size="4" class="start-date ion-text-nowrap">
          {{ _getDayFormatted(datesTemp[0]) || 'Start Date' }}
        </ion-col>
        <ion-col size="4" class="ion-text-center">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </ion-col>
        <ion-col size="4" class="end-date ion-text-right ion-text-nowrap">
          {{ _getDayFormatted(datesTemp[1]) || 'End Date' }}
        </ion-col>
      </ion-row>

      <ion-calendar-week
        [color]="_d.color"
        [weekArray]="_d.weekdays"
        [weekStart]="_d.weekStart">
      </ion-calendar-week>

    </ion-header>

    <ion-content (ionScroll)="onScroll($event)" class="calendar-page" [scrollEvents]="true"
                 [ngClass]="{'multi-selection': _d.pickMode === 'multi'}">

      <div #months>
        <ng-template ngFor let-month [ngForOf]="calendarMonths" [ngForTrackBy]="trackByIndex" let-i="index">
          <div class="month-box" [attr.id]="'month-' + i">
            <h4 class="month-title">{{ _monthFormat(month.original?.date) }}</h4>
            <ion-calendar-month [month]="month"
                                [pickMode]="_d.pickMode"
                                [isSaveHistory]="_d.isSaveHistory"
                                [id]="_d.id"
                                [color]="_d.color"
                                [maxMultiDates]="_d.maxMultiDates"
                                (change)="onChange($event)"
                                [(ngModel)]="datesTemp">
            </ion-calendar-month>
          </div>
        </ng-template>

      </div>

      <ion-infinite-scroll threshold="25%" (ionInfinite)="nextMonth($event)">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>

    <ion-footer>

        <ion-button expand="full" *ngIf="!_d.autoDone" [disabled]="!canDone()" (click)="done()">
          <span *ngIf="_d.doneLabel !== '' && !_d.doneIcon">{{ _d.doneLabel }}</span>
          <ion-icon *ngIf="_d.doneIcon" name="checkmark"></ion-icon>
        </ion-button>

    </ion-footer>
  `, isInline: true, styles: [":host ion-select{max-width:unset}:host ion-select .select-icon>.select-icon-inner,:host ion-select .select-text{color:#fff!important}:host ion-select.select-ios{max-width:unset}:host ion-toolbar ion-button.md{color:var(--ion-color-primary)}:host .dates-toolbar{--background: transparent;padding:0 1rem}:host .dates-toolbar.primary{--background: var(--ion-color-primary)}:host .dates-toolbar.secondary{--background: var(--ion-color-secondary)}:host .dates-toolbar.danger{--background: var(--ion-color-danger)}:host .dates-toolbar.dark{--background: var(--ion-color-dark)}:host .dates-toolbar.light{--background: var(--ion-color-light)}:host .dates-toolbar.transparent{--background: transparent}:host .dates-toolbar.toolbar-md{min-height:44px}:host .ios.dates-toolbar{padding-top:1rem}:host .start-date{padding-left:.5rem}:host .end-date{margin-right:-.5rem}:host .calendar-page{background-color:#fbfbfb}:host .month-box{display:inline-block;width:100%;padding-bottom:1em}:host #month-0{padding-top:1rem}:host .month-title{padding-left:1rem;text-align:left;color:#363749}:host h4{font-weight:400;font-size:1.1rem;display:block;text-align:center;margin:1rem 0 0;color:#929292}body[data-dark-mode=true] :host .month-title{color:#fff}body[data-dark-mode=true] :host .dates-toolbar{color:#fff}\n"], components: [{ type: i1.IonHeader, selector: "ion-header", inputs: ["collapse", "mode", "translucent"] }, { type: i1.IonToolbar, selector: "ion-toolbar", inputs: ["color", "mode"] }, { type: i1.IonButtons, selector: "ion-buttons", inputs: ["collapse"] }, { type: i1.IonButton, selector: "ion-button", inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "form", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] }, { type: i1.IonIcon, selector: "ion-icon", inputs: ["color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] }, { type: i1.IonTitle, selector: "ion-title", inputs: ["color", "size"] }, { type: i1.IonRow, selector: "ion-row" }, { type: i1.IonCol, selector: "ion-col", inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] }, { type: CalendarWeekComponent, selector: "ion-calendar-week", inputs: ["color", "weekArray", "weekStart"] }, { type: i1.IonContent, selector: "ion-content", inputs: ["color", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"] }, { type: MonthComponent, selector: "ion-calendar-month", inputs: ["month", "pickMode", "isSaveHistory", "id", "readonly", "color", "maxMultiDates"], outputs: ["change", "select", "selectStart", "selectEnd"] }, { type: i1.IonInfiniteScroll, selector: "ion-infinite-scroll", inputs: ["disabled", "position", "threshold"] }, { type: i1.IonInfiniteScrollContent, selector: "ion-infinite-scroll-content", inputs: ["loadingSpinner", "loadingText"] }, { type: i1.IonFooter, selector: "ion-footer", inputs: ["collapse", "mode", "translucent"] }], directives: [{ type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModal, decorators: [{
            type: Component,
            args: [{
                    selector: 'ion-calendar-modal',
                    styleUrls: ['./calendar.modal.scss'],
                    template: `
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="secondary">
              <ion-button type='button' slot="icon-only" fill="clear" class="primary" (click)="onCancel()">
              <span *ngIf="_d.closeLabel !== '' && !_d.closeIcon">{{ _d.closeLabel }}</span>
              <ion-icon *ngIf="_d.closeIcon" name="close"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>{{ _d.title }}</ion-title>
      </ion-toolbar>

      <ng-content select="[sub-header]"></ng-content>

      <ion-row *ngIf="_d.pickMode === 'range'" lines="none" [class]="'dates-toolbar'" no-border>
        <ion-col size="4" class="start-date ion-text-nowrap">
          {{ _getDayFormatted(datesTemp[0]) || 'Start Date' }}
        </ion-col>
        <ion-col size="4" class="ion-text-center">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </ion-col>
        <ion-col size="4" class="end-date ion-text-right ion-text-nowrap">
          {{ _getDayFormatted(datesTemp[1]) || 'End Date' }}
        </ion-col>
      </ion-row>

      <ion-calendar-week
        [color]="_d.color"
        [weekArray]="_d.weekdays"
        [weekStart]="_d.weekStart">
      </ion-calendar-week>

    </ion-header>

    <ion-content (ionScroll)="onScroll($event)" class="calendar-page" [scrollEvents]="true"
                 [ngClass]="{'multi-selection': _d.pickMode === 'multi'}">

      <div #months>
        <ng-template ngFor let-month [ngForOf]="calendarMonths" [ngForTrackBy]="trackByIndex" let-i="index">
          <div class="month-box" [attr.id]="'month-' + i">
            <h4 class="month-title">{{ _monthFormat(month.original?.date) }}</h4>
            <ion-calendar-month [month]="month"
                                [pickMode]="_d.pickMode"
                                [isSaveHistory]="_d.isSaveHistory"
                                [id]="_d.id"
                                [color]="_d.color"
                                [maxMultiDates]="_d.maxMultiDates"
                                (change)="onChange($event)"
                                [(ngModel)]="datesTemp">
            </ion-calendar-month>
          </div>
        </ng-template>

      </div>

      <ion-infinite-scroll threshold="25%" (ionInfinite)="nextMonth($event)">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>

    <ion-footer>

        <ion-button expand="full" *ngIf="!_d.autoDone" [disabled]="!canDone()" (click)="done()">
          <span *ngIf="_d.doneLabel !== '' && !_d.doneIcon">{{ _d.doneLabel }}</span>
          <ion-icon *ngIf="_d.doneIcon" name="checkmark"></ion-icon>
        </ion-button>

    </ion-footer>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.ModalController }, { type: i0.ChangeDetectorRef }, { type: CalendarService }]; }, propDecorators: { content: [{
                type: ViewChild,
                args: [IonContent, { static: true }]
            }], monthsEle: [{
                type: ViewChild,
                args: ['months', { static: true }]
            }], ionPage: [{
                type: HostBinding,
                args: ['class.ion-page']
            }], options: [{
                type: Input
            }] } });

class MonthPickerComponent {
    constructor() {
        this.color = defaults.COLOR;
        this.select = new EventEmitter();
        this._thisMonth = new Date();
        this._monthFormat = defaults.MONTH_FORMAT;
        this.MONTH_FORMAT = 'MMMM';
    }
    set monthFormat(value) {
        if (Array.isArray(value) && value.length === 12) {
            this._monthFormat = value;
        }
    }
    get monthFormat() {
        return this._monthFormat;
    }
    _onSelect(month) {
        this.select.emit(month);
    }
    getDate(month) {
        return new Date(this._thisMonth.getFullYear(), month, 1);
    }
}
MonthPickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: MonthPickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
MonthPickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: MonthPickerComponent, selector: "ion-calendar-month-picker", inputs: { month: "month", color: "color", monthFormat: "monthFormat" }, outputs: { select: "select" }, ngImport: i0, template: `
    <div [class]="'month-picker ' + color">
      <div class="month-packer-item"
           [class.this-month]=" i === _thisMonth.getMonth() && month.original?.year === _thisMonth.getFullYear()"
           *ngFor="let item of _monthFormat; let i = index">
        <button type="button" (click)="_onSelect(i)" [attr.aria-label]="getDate(i) | date:MONTH_FORMAT">{{ item }}</button>
      </div>
    </div>
  `, isInline: true, styles: [":host .month-picker{margin:20px 0;display:inline-block;width:100%}:host .month-packer-item{width:25%;box-sizing:border-box;float:left;height:50px;padding:5px}:host .month-packer-item button{border-radius:32px;width:100%;height:100%;font-size:.9em;background-color:transparent}:host .month-picker.primary .month-packer-item.this-month button{border:1px solid var(--ion-color-primary)}:host .month-picker.primary .month-packer-item.active button{background-color:var(--ion-color-primary);color:#fff}:host .month-picker.secondary .month-packer-item.this-month button{border:1px solid var(--ion-color-secondary)}:host .month-picker.secondary .month-packer-item.active button{background-color:var(--ion-color-secondary);color:#fff}:host .month-picker.danger .month-packer-item.this-month button{border:1px solid var(--ion-color-danger)}:host .month-picker.danger .month-packer-item.active button{background-color:var(--ion-color-danger);color:#fff}:host .month-picker.dark .month-packer-item.this-month button{border:1px solid var(--ion-color-dark)}:host .month-picker.dark .month-packer-item.active button{background-color:var(--ion-color-dark);color:#fff}:host .month-picker.light .month-packer-item.this-month button{border:1px solid var(--ion-color-light)}:host .month-picker.light .month-packer-item.active button{background-color:var(--ion-color-light);color:#9e9e9e}:host .month-picker.transparent{background-color:transparent}:host .month-picker.transparent .month-packer-item.this-month button{border:1px solid var(--ion-color-light)}:host .month-picker.transparent .month-packer-item.active button{background-color:var(--ion-color-light);color:#9e9e9e}:host .month-picker.cal-color .month-packer-item.this-month button{border:1px solid}:host .month-picker.cal-color .month-packer-item.active button{color:#fff}\n"], directives: [{ type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], pipes: { "date": i1$1.DatePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: MonthPickerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ion-calendar-month-picker',
                    styleUrls: ['./month-picker.component.scss'],
                    template: `
    <div [class]="'month-picker ' + color">
      <div class="month-packer-item"
           [class.this-month]=" i === _thisMonth.getMonth() && month.original?.year === _thisMonth.getFullYear()"
           *ngFor="let item of _monthFormat; let i = index">
        <button type="button" (click)="_onSelect(i)" [attr.aria-label]="getDate(i) | date:MONTH_FORMAT">{{ item }}</button>
      </div>
    </div>
  `,
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { month: [{
                type: Input
            }], color: [{
                type: Input
            }], select: [{
                type: Output
            }], monthFormat: [{
                type: Input
            }] } });

const ION_CAL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CalendarComponent),
    multi: true,
};
class CalendarComponent {
    constructor(calSvc) {
        this.calSvc = calSvc;
        this._view = 'days';
        this._calendarMonthValue = [null, null];
        this._showToggleButtons = true;
        this._showMonthPicker = true;
        this.format = defaults.DATE_FORMAT;
        this.type = 'string';
        this.readonly = false;
        this.change = new EventEmitter();
        this.monthChange = new EventEmitter();
        this.select = new EventEmitter();
        this.selectStart = new EventEmitter();
        this.selectEnd = new EventEmitter();
        this.MONTH_DATE_FORMAT = 'MMMM yyyy';
        this._onChanged = () => { };
        this._onTouched = () => { };
    }
    get showToggleButtons() {
        return this._showToggleButtons;
    }
    set showToggleButtons(value) {
        this._showToggleButtons = value;
    }
    get showMonthPicker() {
        return this._showMonthPicker;
    }
    set showMonthPicker(value) {
        this._showMonthPicker = value;
    }
    set options(value) {
        this._options = value;
        this.initOpt();
        if (this.monthOpt && this.monthOpt.original) {
            this.monthOpt = this.createMonth(this.monthOpt.original.time);
        }
    }
    get options() {
        return this._options;
    }
    ngOnInit() {
        this.initOpt();
        this.monthOpt = this.createMonth(new Date().getTime());
    }
    getViewDate() {
        return this._handleType(this.monthOpt.original.time);
    }
    getDate(date) {
        return new Date(date);
    }
    setViewDate(value) {
        this.monthOpt = this.createMonth(this._payloadToTimeNumber(value));
    }
    switchView() {
        this._view = this._view === 'days' ? 'month' : 'days';
    }
    prev() {
        if (this._view === 'days') {
            this.backMonth();
        }
        else {
            this.prevYear();
        }
    }
    next() {
        if (this._view === 'days') {
            this.nextMonth();
        }
        else {
            this.nextYear();
        }
    }
    prevYear() {
        if (moment(this.monthOpt.original.time).year() === 1970)
            return;
        const backTime = moment(this.monthOpt.original.time)
            .subtract(1, 'year')
            .valueOf();
        this.monthOpt = this.createMonth(backTime);
    }
    nextYear() {
        const nextTime = moment(this.monthOpt.original.time)
            .add(1, 'year')
            .valueOf();
        this.monthOpt = this.createMonth(nextTime);
    }
    nextMonth() {
        const nextTime = moment(this.monthOpt.original.time)
            .add(1, 'months')
            .valueOf();
        this.monthChange.emit({
            oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
            newMonth: this.calSvc.multiFormat(nextTime),
        });
        this.monthOpt = this.createMonth(nextTime);
    }
    canNext() {
        if (!this._d.to || this._view !== 'days')
            return true;
        return this.monthOpt.original.time < moment(this._d.to).valueOf();
    }
    backMonth() {
        const backTime = moment(this.monthOpt.original.time)
            .subtract(1, 'months')
            .valueOf();
        this.monthChange.emit({
            oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
            newMonth: this.calSvc.multiFormat(backTime),
        });
        this.monthOpt = this.createMonth(backTime);
    }
    canBack() {
        if (!this._d.from || this._view !== 'days')
            return true;
        return this.monthOpt.original.time > moment(this._d.from).valueOf();
    }
    monthOnSelect(month) {
        this._view = 'days';
        const newMonth = moment(this.monthOpt.original.time)
            .month(month)
            .valueOf();
        this.monthChange.emit({
            oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
            newMonth: this.calSvc.multiFormat(newMonth),
        });
        this.monthOpt = this.createMonth(newMonth);
    }
    onChanged($event) {
        switch (this._d.pickMode) {
            case pickModes.SINGLE:
                const date = this._handleType($event[0].time);
                this._onChanged(date);
                this.change.emit(date);
                break;
            case pickModes.RANGE:
                if ($event[0] && $event[1]) {
                    const rangeDate = {
                        from: this._handleType($event[0].time),
                        to: this._handleType($event[1].time),
                    };
                    this._onChanged(rangeDate);
                    this.change.emit(rangeDate);
                }
                break;
            case pickModes.MULTI:
                const dates = [];
                for (let i = 0; i < $event.length; i++) {
                    if ($event[i] && $event[i].time) {
                        const pushData = this._handleType($event[i].time);
                        dates.push(pushData);
                    }
                }
                this._onChanged(dates);
                this.change.emit(dates);
                break;
            default:
        }
    }
    swipeEvent($event) {
        const isNext = $event.deltaX < 0;
        if (isNext && this.canNext()) {
            this.nextMonth();
        }
        else if (!isNext && this.canBack()) {
            this.backMonth();
        }
    }
    _payloadToTimeNumber(value) {
        let date;
        if (this.type === 'string') {
            date = moment(value, this.format);
        }
        else {
            date = moment(value);
        }
        return date.valueOf();
    }
    _monthFormat(date) {
        return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'));
    }
    initOpt() {
        if (this._options && typeof this._options.showToggleButtons === 'boolean') {
            this.showToggleButtons = this._options.showToggleButtons;
        }
        if (this._options && typeof this._options.showMonthPicker === 'boolean') {
            this.showMonthPicker = this._options.showMonthPicker;
            if (this._view !== 'days' && !this.showMonthPicker) {
                this._view = 'days';
            }
        }
        this._d = this.calSvc.safeOpt(this._options || {});
    }
    createMonth(date) {
        return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
    }
    _createCalendarDay(value) {
        return this.calSvc.createCalendarDay(this._payloadToTimeNumber(value), this._d);
    }
    _handleType(value) {
        const date = moment(value);
        switch (this.type) {
            case 'string':
                return date.format(this.format);
            case 'js-date':
                return date.toDate();
            case 'moment':
                return date;
            case 'time':
                return date.valueOf();
            case 'object':
                return date.toObject();
            default:
                return date;
        }
    }
    writeValue(obj) {
        this._writeValue(obj);
        if (obj) {
            if (this._calendarMonthValue[0]) {
                this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
            }
            else {
                this.monthOpt = this.createMonth(new Date().getTime());
            }
        }
    }
    registerOnChange(fn) {
        this._onChanged = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    _writeValue(value) {
        if (!value) {
            this._calendarMonthValue = [null, null];
            return;
        }
        switch (this._d.pickMode) {
            case 'single':
                this._calendarMonthValue[0] = this._createCalendarDay(value);
                break;
            case 'range':
                if (value.from) {
                    this._calendarMonthValue[0] = value.from ? this._createCalendarDay(value.from) : null;
                }
                if (value.to) {
                    this._calendarMonthValue[1] = value.to ? this._createCalendarDay(value.to) : null;
                }
                break;
            case 'multi':
                if (Array.isArray(value)) {
                    this._calendarMonthValue = value.map(e => {
                        return this._createCalendarDay(e);
                    });
                }
                else {
                    this._calendarMonthValue = [null, null];
                }
                break;
            default:
        }
    }
}
CalendarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarComponent, deps: [{ token: CalendarService }], target: i0.ɵɵFactoryTarget.Component });
CalendarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: CalendarComponent, selector: "ion-calendar", inputs: { format: "format", type: "type", readonly: "readonly", options: "options" }, outputs: { change: "change", monthChange: "monthChange", select: "select", selectStart: "selectStart", selectEnd: "selectEnd" }, providers: [ION_CAL_VALUE_ACCESSOR], ngImport: i0, template: `
    <div class="title">
      <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title">
        <ion-button type="button"
                    fill="clear"
                    class="switch-btn"
                    [attr.aria-label]="getDate(monthOpt?.original?.time) | date:MONTH_DATE_FORMAT"
                    (click)="switchView()">
          {{ _monthFormat(monthOpt.original.time) }}
          <ion-icon class="arrow-dropdown"
                    [name]="_view === 'days' ? 'md-arrow-dropdown' : 'md-arrow-dropup'"></ion-icon>
        </ion-button>
      </ng-template>
      <ng-template #title>
        <div class="switch-btn"
             [attr.aria-label]="getDate(monthOpt.original.time) | date:MONTH_DATE_FORMAT">
          {{ _monthFormat(monthOpt.original.time) }}
        </div>
      </ng-template>
      <ng-template [ngIf]="_showToggleButtons">
        <ion-button type="button" fill="clear" class="back" [disabled]="!canBack()" (click)="prev()">
          <ion-icon slot="icon-only" size="small" name="ios-arrow-back"></ion-icon>
        </ion-button>
        <ion-button type="button" fill="clear" class="forward" [disabled]="!canNext()" (click)="next()">
          <ion-icon slot="icon-only" size="small" name="ios-arrow-forward"></ion-icon>
        </ion-button>
      </ng-template>
    </div>
    <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
      <ion-calendar-week color="transparent"
                         [weekArray]="_d.weekdays"
                         [weekStart]="_d.weekStart">
      </ion-calendar-week>

      <ion-calendar-month class="component-mode"
                          [(ngModel)]="_calendarMonthValue"
                          [month]="monthOpt"
                          [readonly]="readonly"
                          (change)="onChanged($event)"
                          (swipe)="swipeEvent($event)"
                          (select)="select.emit($event)"
                          (selectStart)="selectStart.emit($event)"
                          (selectEnd)="selectEnd.emit($event)"
                          [pickMode]="_d.pickMode"
                          [color]="_d.color">
      </ion-calendar-month>
    </ng-template>

    <ng-template #monthPicker>
      <ion-calendar-month-picker [color]="_d.color ? _d.color : ''"
                                 [monthFormat]="_options['monthPickerFormat'] && _options['monthPickerFormat'].length > 0 ? _options['monthPickerFormat'] : []  "
                                 (select)="monthOnSelect($event)"
                                 [month]="monthOpt">
      </ion-calendar-month-picker>
    </ng-template>
  `, isInline: true, styles: [":host{padding:10px 20px;box-sizing:border-box;display:inline-block;background-color:#fff;width:100%}:host .title{padding:0 40px;overflow:hidden}:host .title .back,:host .title .forward,:host .title .switch-btn{display:block;position:relative;float:left;min-height:32px;margin:0;padding:0;--padding-start: 0;--padding-end: 0;font-size:15px}:host .title .back,:host .title .forward{color:#757575}:host .title .back{margin-left:-100%;left:-40px;width:40px}:host .title .forward{margin-left:-40px;right:-40px;width:40px}:host .title .switch-btn{--margin-top: 0;--margin-bottom: 0;--margin-start: auto;--margin-end: auto;width:100%;text-align:center;line-height:32px;color:#757575}:host .title .switch-btn .arrow-dropdown{margin-left:5px}:host .days.between .days-btn.is-last,:host .days.between .days-btn.is-first{border-radius:0}:host .component-mode .days.startSelection.is-last-wrap:after{border-radius:0}:host .component-mode .days.endSelection.is-first-wrap:after{border-radius:0}\n"], components: [{ type: i1.IonButton, selector: "ion-button", inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "form", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] }, { type: i1.IonIcon, selector: "ion-icon", inputs: ["color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] }, { type: CalendarWeekComponent, selector: "ion-calendar-week", inputs: ["color", "weekArray", "weekStart"] }, { type: MonthComponent, selector: "ion-calendar-month", inputs: ["month", "pickMode", "isSaveHistory", "id", "readonly", "color", "maxMultiDates"], outputs: ["change", "select", "selectStart", "selectEnd"] }, { type: MonthPickerComponent, selector: "ion-calendar-month-picker", inputs: ["month", "color", "monthFormat"], outputs: ["select"] }], directives: [{ type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], pipes: { "date": i1$1.DatePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ion-calendar',
                    providers: [ION_CAL_VALUE_ACCESSOR],
                    styleUrls: ['./calendar.component.scss'],
                    template: `
    <div class="title">
      <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title">
        <ion-button type="button"
                    fill="clear"
                    class="switch-btn"
                    [attr.aria-label]="getDate(monthOpt?.original?.time) | date:MONTH_DATE_FORMAT"
                    (click)="switchView()">
          {{ _monthFormat(monthOpt.original.time) }}
          <ion-icon class="arrow-dropdown"
                    [name]="_view === 'days' ? 'md-arrow-dropdown' : 'md-arrow-dropup'"></ion-icon>
        </ion-button>
      </ng-template>
      <ng-template #title>
        <div class="switch-btn"
             [attr.aria-label]="getDate(monthOpt.original.time) | date:MONTH_DATE_FORMAT">
          {{ _monthFormat(monthOpt.original.time) }}
        </div>
      </ng-template>
      <ng-template [ngIf]="_showToggleButtons">
        <ion-button type="button" fill="clear" class="back" [disabled]="!canBack()" (click)="prev()">
          <ion-icon slot="icon-only" size="small" name="ios-arrow-back"></ion-icon>
        </ion-button>
        <ion-button type="button" fill="clear" class="forward" [disabled]="!canNext()" (click)="next()">
          <ion-icon slot="icon-only" size="small" name="ios-arrow-forward"></ion-icon>
        </ion-button>
      </ng-template>
    </div>
    <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
      <ion-calendar-week color="transparent"
                         [weekArray]="_d.weekdays"
                         [weekStart]="_d.weekStart">
      </ion-calendar-week>

      <ion-calendar-month class="component-mode"
                          [(ngModel)]="_calendarMonthValue"
                          [month]="monthOpt"
                          [readonly]="readonly"
                          (change)="onChanged($event)"
                          (swipe)="swipeEvent($event)"
                          (select)="select.emit($event)"
                          (selectStart)="selectStart.emit($event)"
                          (selectEnd)="selectEnd.emit($event)"
                          [pickMode]="_d.pickMode"
                          [color]="_d.color">
      </ion-calendar-month>
    </ng-template>

    <ng-template #monthPicker>
      <ion-calendar-month-picker [color]="_d.color ? _d.color : ''"
                                 [monthFormat]="_options['monthPickerFormat'] && _options['monthPickerFormat'].length > 0 ? _options['monthPickerFormat'] : []  "
                                 (select)="monthOnSelect($event)"
                                 [month]="monthOpt">
      </ion-calendar-month-picker>
    </ng-template>
  `,
                }]
        }], ctorParameters: function () { return [{ type: CalendarService }]; }, propDecorators: { format: [{
                type: Input
            }], type: [{
                type: Input
            }], readonly: [{
                type: Input
            }], change: [{
                type: Output
            }], monthChange: [{
                type: Output
            }], select: [{
                type: Output
            }], selectStart: [{
                type: Output
            }], selectEnd: [{
                type: Output
            }], options: [{
                type: Input
            }] } });

class CalendarController {
    constructor(modalCtrl, calSvc) {
        this.modalCtrl = modalCtrl;
        this.calSvc = calSvc;
    }
    /**
     * @deprecated
     * @param {CalendarModalOptions} calendarOptions
     * @param {ModalOptions} modalOptions
     * @returns {any}
     */
    openCalendar(calendarOptions, modalOptions = {}) {
        const options = this.calSvc.safeOpt(calendarOptions);
        return this.modalCtrl
            .create(Object.assign({ component: CalendarModal, componentProps: {
                options,
            } }, modalOptions))
            .then((calendarModal) => {
            calendarModal.present();
            return calendarModal.onDidDismiss().then((event) => {
                return event.data ? Promise.resolve(event.data) : Promise.reject('cancelled');
            });
        });
    }
}
CalendarController.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarController, deps: [{ token: i1.ModalController }, { token: CalendarService }], target: i0.ɵɵFactoryTarget.Injectable });
CalendarController.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarController });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarController, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ModalController }, { type: CalendarService }]; } });

const CALENDAR_COMPONENTS = [
    CalendarModal,
    CalendarWeekComponent,
    MonthComponent,
    CalendarComponent,
    MonthPickerComponent
];

function calendarController(modalCtrl, calSvc) {
    return new CalendarController(modalCtrl, calSvc);
}
class CalendarModule {
    static forRoot(defaultOptions = {}) {
        return {
            ngModule: CalendarModule,
            providers: [
                { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions }
            ]
        };
    }
}
CalendarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CalendarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModule, declarations: [CalendarModal, CalendarWeekComponent, MonthComponent, CalendarComponent, MonthPickerComponent], imports: [CommonModule, IonicModule, FormsModule], exports: [CalendarModal, CalendarWeekComponent, MonthComponent, CalendarComponent, MonthPickerComponent] });
CalendarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModule, providers: [
        CalendarService,
        {
            provide: CalendarController,
            useFactory: calendarController,
            deps: [ModalController, CalendarService],
        },
    ], imports: [[CommonModule, IonicModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: CalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, IonicModule, FormsModule],
                    declarations: CALENDAR_COMPONENTS,
                    exports: CALENDAR_COMPONENTS,
                    entryComponents: CALENDAR_COMPONENTS,
                    providers: [
                        CalendarService,
                        {
                            provide: CalendarController,
                            useFactory: calendarController,
                            deps: [ModalController, CalendarService],
                        },
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }] });

/*
 * Public API Surface of ion-calendar
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CalendarComponent, CalendarComponentMonthChange, CalendarController, CalendarModal, CalendarModule, CalendarMonth, CalendarResult, CalendarWeekComponent, DEFAULT_CALENDAR_OPTIONS, MonthComponent, MonthPickerComponent };
//# sourceMappingURL=ion2-calendar.js.map
