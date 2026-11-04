import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GenreListComponent } from "./ui/genre-list.component";
import { GenreModel } from "./data/genre.model";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject, takeUntil } from "rxjs";
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
  imports: [GenreListComponent, MatButtonModule, NgIf, AsyncPipe],
  template: `
    <h1>Genres</h1>
    <p>
      <button mat-raised-button color="primary" (click)="onAddUpdate('Add')">
        Add Genre
      </button>
    </p>
    <ng-container *ngIf="genre$ | async as genres">
      <app-genre-list
        [genres]="genres"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
      />
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreComponent {
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  store = inject(Store);
  genre$: Observable<GenreModel[]> = this.store.select(selectGenres);
  loading$: Observable<boolean> = this.store.select(selectGenreLoading);
  error$: Observable<HttpErrorResponse | null> =
    this.store.select(selectGenreError);

  onEdit(genre: GenreModel) {
    this.onAddUpdate("Update", genre);
  }

  onDelete(genre: GenreModel) {
    if (window.confirm("Are you sure to delete?")) {
      this.store.dispatch(GenreActions.deleteGenre({ id: genre.id }));
    }
  }

  onAddUpdate(action: string, genre: GenreModel | null = null) {
    const dialogRef = this.dialog.open(AddGenreDialogComponent, {
      data: { genre, title: action + " Genre" },
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
