import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs";
import { GenreModel } from "../../genre/data/genre.model";
import { PublicBookFilters } from "../data/public-book.service";

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
        class="sort-field"
        subscriptSizing="dynamic"
      >
        <mat-icon matPrefix>sort</mat-icon>
        <mat-label>Sort books</mat-label>
        <mat-select [formControl]="form.controls.sortBy">
          <mat-option value="">Title: A-Z</mat-option>
          <mat-option value="title desc">Title: Z-A</mat-option>
          <mat-option value="publishedYear desc">Newest first</mat-option>
          <mat-option value="publishedYear asc">Oldest first</mat-option>
          <mat-option value="price asc">Price: low to high</mat-option>
          <mat-option value="price desc">Price: high to low</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="range-group">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>Year from</mat-label>
          <input matInput type="number" min="0" [formControl]="form.controls.publishedFrom" />
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>Year to</mat-label>
          <input matInput type="number" min="0" [formControl]="form.controls.publishedTo" />
        </mat-form-field>
      </div>

      <div class="range-group">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>Min price</mat-label>
          <input matInput type="number" min="0" [formControl]="form.controls.minPrice" />
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>Max price</mat-label>
          <input matInput type="number" min="0" [formControl]="form.controls.maxPrice" />
        </mat-form-field>
      </div>

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
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
      }

      .search-field {
        flex: 1 1 320px;
        margin-bottom: 16px;
      }

      .genre-field {
        flex: 0 1 260px;
        margin-bottom: 16px;
      }

      .sort-field {
        flex: 0 1 210px;
      }

      .range-group {
        display: flex;
        gap: 10px;
        flex: 1 1 300px;
      }

      .range-group mat-form-field {
        min-width: 0;
        flex: 1 1 140px;
      }

      @media (max-width: 720px) {
        .search-field,
        .genre-field,
        .sort-field,
        .range-group {
          flex-basis: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPublicFilterComponent implements OnChanges {
  @Input({ required: true }) genres!: ReadonlyArray<GenreModel>;
  @Input({ required: true }) filters!: PublicBookFilters;
  @Output() filtersChange = new EventEmitter<PublicBookFilters>();

  readonly form = new FormGroup({
    searchTerm: new FormControl("", { nonNullable: true }),
    genreIds: new FormControl<number[]>([], { nonNullable: true }),
    sortBy: new FormControl("", { nonNullable: true }),
    publishedFrom: new FormControl<number | null>(null),
    publishedTo: new FormControl<number | null>(null),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
  });

  get searchTerm(): FormControl<string> {
    return this.form.controls.searchTerm;
  }

  get selectedGenres(): FormControl<number[]> {
    return this.form.controls.genreIds;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["filters"] || !this.filters) return;

    this.form.setValue(
      { ...this.filters, genreIds: [...this.filters.genreIds] },
      { emitEvent: false }
    );
  }

  clearFilters() {
    this.form.setValue({
      searchTerm: "",
      genreIds: [],
      sortBy: "",
      publishedFrom: null,
      publishedTo: null,
      minPrice: null,
      maxPrice: null,
    });
  }

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(350),
        map(() => this.form.getRawValue()),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        tap((filters) => this.filtersChange.emit(filters)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
