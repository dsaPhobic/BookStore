import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { debounceTime, tap } from "rxjs";
import { GenreModel } from "../../genre/data/genre.model";

@Component({
  selector: "app-book-public-filter",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="toolbar">
      <mat-form-field
        appearance="outline"
        class="search-field"
        subscriptSizing="dynamic"
      >
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search by title or author...</mat-label>
        <input matInput [formControl]="searchTerm" />
      </mat-form-field>

      <mat-form-field
        appearance="outline"
        class="genre-field"
        subscriptSizing="dynamic"
      >
        <mat-icon matPrefix>category</mat-icon>
        <mat-label>Filter by Genre</mat-label>
        <mat-select [formControl]="selectedGenres" multiple>
          @for (genre of genres; track genre.id) {
            <mat-option [value]="genre.id">{{ genre.genreName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button
        type="button"
        mat-stroked-button
        (click)="clearFilters()"
        style="margin-bottom: 16px"
      >
        <mat-icon>restart_alt</mat-icon>
        Reset
      </button>
    </div>
  `,
  styles: [
    `
      .toolbar {
        padding: 18px 20px 2px;
        margin-bottom: 24px;
        gap: 14px;
      }

      .search-field {
        flex: 1 1 320px;
        margin-bottom: 16px;
      }

      .genre-field {
        flex: 0 1 260px;
        margin-bottom: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPublicFilterComponent {
  searchTerm = new FormControl("");
  @Output() onSearch = new EventEmitter<string | null>();
  @Input({ required: true }) genres!: ReadonlyArray<GenreModel>;
  @Output() onGenreSelect = new EventEmitter<Array<number>>();

  selectedGenres = new FormControl<Array<number>>([]);

  clearFilters() {
    this.searchTerm.setValue("");
    this.selectedGenres.setValue([]);
  }

  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(350),
        tap((sTerm) => {
          this.onSearch.emit(sTerm);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.selectedGenres.valueChanges
      .pipe(
        tap((genreIds) => {
          if (genreIds) this.onGenreSelect.emit(genreIds);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
