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
  selector: "app-author-filter",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field>
      <mat-label>Search by name</mat-label>
      <input type="text" matInput [formControl]="searchTerm" />
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 500px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorFilter {
  searchTerm = new FormControl<string>("");
  @Output() filter = new EventEmitter<string | null>();

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
  }
}
