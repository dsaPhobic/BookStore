import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-book-filter",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="toolbar">
      <mat-form-field
        appearance="outline"
        class="search-input"
        subscriptSizing="dynamic"
      >
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search by title or description...</mat-label>
        <input type="text" matInput [formControl]="searchTerm" />
      </mat-form-field>

      <mat-form-field
        appearance="outline"
        class="year-input"
        subscriptSizing="dynamic"
      >
        <mat-label>Published From</mat-label>
        <input
          type="number"
          matInput
          placeholder="e.g. 2000"
          [formControl]="publishedFrom"
        />
      </mat-form-field>

      <mat-form-field
        appearance="outline"
        class="year-input"
        subscriptSizing="dynamic"
      >
        <mat-label>Published To</mat-label>
        <input
          type="number"
          matInput
          placeholder="e.g. 2026"
          [formControl]="publishedTo"
        />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .toolbar {
        padding: 16px 20px;
      }

      .search-input {
        flex: 1 1 320px;
      }

      .year-input {
        width: 170px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFilterComponent {
  searchTerm = new FormControl<string>("");
  publishedFrom = new FormControl<number | null>(null);
  publishedTo = new FormControl<number | null>(null);
  @Output() filter = new EventEmitter<string | null>();
  @Output() publishFromEvent = new EventEmitter<number | null>();
  @Output() publishToEvent = new EventEmitter<number | null>();

  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(350),
        tap((sTerm) => {
          this.filter.emit(sTerm);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.publishedFrom.valueChanges
      .pipe(
        debounceTime(350),
        tap((val) => {
          this.publishFromEvent.emit(val);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.publishedTo.valueChanges
      .pipe(
        debounceTime(350),
        tap((val) => {
          this.publishToEvent.emit(val);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
