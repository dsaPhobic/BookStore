import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  output,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { debounceTime, tap } from "rxjs";
import { GenreModel } from "../../genre/data/genre.model";

@Component({
  selector: "app-book-public-filter",
  standalone: true,
  imports: [MatFormField, MatInputModule, ReactiveFormsModule, MatSelectModule],
  template: `
    <div class="book-filters">
      <mat-form-field appearance="outline" class="searchFilter">
        <mat-label>Filter by Title/Author</mat-label>
        <input matInput [formControl]="searchTerm" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Genres</mat-label>
        <mat-select [formControl]="selectedGenres" multiple>
          @for (genre of genres; track genre.id) {
          <mat-option [value]="genre.id">{{ genre.genreName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .book-filters {
        padding-top: 10px;
        padding-left: 96px;
        width: 100%;
        display: flex;
        gap: 10px;
      }

      .searchFilter {
        width: 400px;
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

  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(400),
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
