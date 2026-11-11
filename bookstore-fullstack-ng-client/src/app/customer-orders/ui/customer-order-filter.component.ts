import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, tap } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { getDateWithoutTimezone } from "../../utils/date.utils";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-customer-order-filter",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="bs-filter-bar">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search customer, email, book title...</mat-label>
        <input matInput [formControl]="search" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Order date range</mat-label>
        <mat-date-range-input disabled [formGroup]="range" [rangePicker]="picker">
          <input
            matStartDate
            formControlName="dateFrom"
            placeholder="Start date"
          />
          <input matEndDate formControlName="dateTo" placeholder="End date" />
        </mat-date-range-input>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-date-range-picker #picker disabled="false"></mat-date-range-picker>
      </mat-form-field>

      <button
        mat-stroked-button
        type="button"
        class="clear-btn"
        (click)="clearFilters()"
      >
        <mat-icon>filter_alt_off</mat-icon>
        Reset
      </button>
    </div>
  `,
  styles: [
    `
      .filter-field {
        flex: 1 1 280px;
      }
      .clear-btn {
        height: 44px;
        border-radius: 10px !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrderFilter {
  @Output() filterByPurchaseDate = new EventEmitter<{
    dateFrom: string | null;
    dateTo: string | null;
  }>();
  @Output() onSearch = new EventEmitter<string | null>();
  @Output() clearFilter = new EventEmitter<void>();

  range = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });
  search = new FormControl<string | null>(null);

  clearFilters() {
    this.range.patchValue({ dateFrom: null, dateTo: null });
    this.search.patchValue(null);
    this.clearFilter.emit();
  }
  constructor() {
    this.range.valueChanges
      .pipe(
        tap((v) => {
          if (v.dateFrom && v.dateTo) {
            this.filterByPurchaseDate.emit({
              dateFrom: getDateWithoutTimezone(v.dateFrom),
              dateTo: getDateWithoutTimezone(v.dateTo),
            });
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.search.valueChanges
      .pipe(
        debounceTime(300),
        tap((v) => this.onSearch.emit(v)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
