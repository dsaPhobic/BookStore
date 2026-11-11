import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GenreListComponent } from "./ui/genre-list.component";
import { GenreModel } from "./data/genre.model";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, map, Observable, startWith, Subject, takeUntil } from "rxjs";
import { AddGenreDialogComponent } from "./ui/add-genre-dialog.component";
import { Store } from "@ngrx/store";
import {
  selectGenreError,
  selectGenreLoading,
  selectGenres,
} from "./state/genre.selectors";
import { HttpErrorResponse } from "@angular/common/http";
import { AsyncPipe, NgIf } from "@angular/common";
import { GenreActions } from "./state/genre.actions";

@Component({
  selector: "app-book",
  standalone: true,
  imports: [
    GenreListComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
  ],
  template: `
    <div class="page-header">
      <div>
        <span class="eyebrow">CATALOG ADMINISTRATION</span>
        <h1>Manage Genres</h1>
        <p class="page-subtitle">
          Organize your books into clear genres for easier discovery.
        </p>
      </div>
      <button
        mat-flat-button
        color="accent"
        type="button"
        (click)="onAddUpdate('Add')"
      >
        <mat-icon>add</mat-icon>
        Add Genre
      </button>
    </div>

    <div class="toolbar">
      <mat-form-field
        appearance="outline"
        class="search-input"
        subscriptSizing="dynamic"
      >
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search genres...</mat-label>
        <input type="text" matInput [formControl]="searchControl" />
      </mat-form-field>
    </div>

    <ng-container *ngIf="filteredGenres$ | async as genres">
      <app-genre-list
        [genres]="genres"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
      />
    </ng-container>
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
export class GenreComponent {
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  store = inject(Store);
  searchControl = new FormControl<string>("");

  genre$: Observable<GenreModel[]> = this.store.select(selectGenres);
  loading$: Observable<boolean> = this.store.select(selectGenreLoading);
  error$: Observable<HttpErrorResponse | null> =
    this.store.select(selectGenreError);

  filteredGenres$: Observable<GenreModel[]> = combineLatest([
    this.genre$,
    this.searchControl.valueChanges.pipe(startWith("")),
  ]).pipe(
    map(([genres, term]) => {
      const q = (term ?? "").trim().toLowerCase();
      if (!q) return genres;
      return genres.filter((g) => g.genreName.toLowerCase().includes(q));
    })
  );

  onEdit(genre: GenreModel) {
    this.onAddUpdate("Update", genre);
  }

  onDelete(genre: GenreModel) {
    if (window.confirm(`Are you sure to delete "${genre.genreName}"?`)) {
      this.store.dispatch(GenreActions.deleteGenre({ id: genre.id }));
    }
  }

  onAddUpdate(action: string, genre: GenreModel | null = null) {
    const dialogRef = this.dialog.open(AddGenreDialogComponent, {
      data: { genre, title: action + " Genre" },
      width: "420px",
    });

    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedGenre) => {
        if (!submittedGenre) return;
        if (submittedGenre.id) {
          this.store.dispatch(
            GenreActions.updateGenre({ genre: submittedGenre })
          );
        } else {
          this.store.dispatch(GenreActions.addGenre({ genre: submittedGenre }));
        }
        dialogRef.componentInstance.genreForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  constructor() {
    this.store.dispatch(GenreActions.loadGenre());
  }
}
