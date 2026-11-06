import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-book-filter",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field>
      <mat-label>Search by name</mat-label>
      <input type="text" matInput [formControl]="searchTerm" />
    </mat-form-field>
    <mat-form-field class="published-filter">
      <mat-label>Published From</mat-label>
      <input type="number" matInput [formControl]="publishedFrom" />
    </mat-form-field>
    <mat-form-field class="published-filter">
      <mat-label>Published To</mat-label>
      <input type="number" matInput [formControl]="publishedTo" />
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 10px;
      }
      mat-form-field {
        width: 500px;
      }

      .published-filter {
        width: 200px;
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
        debounceTime(400),
        tap((sTerm) => {
          this.filter.emit(sTerm);
        }),

        takeUntilDestroyed()
      )
      .subscribe();

    this.publishedFrom.valueChanges
      .pipe(
        debounceTime(400),
        tap((val) => {
          this.publishFromEvent.emit(val);
        })
      )
      .subscribe();

    this.publishedTo.valueChanges
      .pipe(
        debounceTime(400),
        tap((val) => {
          this.publishToEvent.emit(val);
        })
      )
      .subscribe();
  }
}
