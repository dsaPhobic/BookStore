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
  selector: "app-author-filter",
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
        <mat-label>Search author by name...</mat-label>
        <input type="text" matInput [formControl]="searchTerm" />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .toolbar {
        padding: 16px 20px;
      }
      .search-input {
        width: 100%;
        max-width: 440px;
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
        debounceTime(350),
        tap((sTerm) => {
          this.filter.emit(sTerm);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
