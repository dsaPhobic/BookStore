import { AsyncPipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from "@angular/core";
import { Author } from "./data/author.model";
import { AuthorListComponent } from "./ui/author-list.component";
import { Store } from "@ngrx/store";
import {
  selectAuthorError,
  selectAuthorLoading,
  selectAuthors,
  selectAuthorTotalCount,
} from "./state/author.selectors";
import { Observable, Subject, takeUntil } from "rxjs";
import { authorActions } from "./state/author.actions";
import { AuthorPaginatorComponent } from "./ui/author-paginator.component";
import { PageSelectorModel } from "../common/page-selector.model";
import { SortModel } from "../common/sort.model";
import { AuthorFilter } from "./ui/author.filter";
import { MatDialog } from "@angular/material/dialog";
import { AuthorDialogComponent } from "./ui/author-dialog.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-author",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    AuthorListComponent,
    AuthorPaginatorComponent,
    AuthorFilter,
    MatButtonModule,
  ],
  template: `
    <h1>Authors</h1>
    <p>
      <button
        type="button"
        (click)="onAddUpdate('Add', null)"
        mat-raised-button
        color="accent"
      >
        +
      </button>
    </p>
    <app-author-filter (filter)="onFilter($event)" />

    <ng-container *ngIf="authors$ | async as authors">
      <app-author-list
        [authors]="authors"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (sort)="onSort($event)"
      />
    </ng-container>

    <ng-container *ngIf="totalCount$ | async as totalCount">
      <app-author-paginator
        (pageSelect)="onPageSelect($event)"
        [totalRecords]="totalCount"
      />
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent implements OnDestroy {
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  store = inject(Store);
  authors$: Observable<readonly Author[]> = this.store.select(selectAuthors);
  totalCount$ = this.store.select(selectAuthorTotalCount);
  loading$ = this.store.select(selectAuthorLoading);
  error$ = this.store.select(selectAuthorError);

  onEdit(author: Author) {
    this.onAddUpdate("Update", author);
  }

  onAddUpdate(action: string, author: Author | null = null) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      data: { author, title: action + " Author" },
    });

    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedAuthor) => {
        if (!submittedAuthor) return;
        if (submittedAuthor.id) {
          // update book
          this.store.dispatch(
            authorActions.updateAuthor({ author: submittedAuthor })
          );
        } else {
          this.store.dispatch(
            authorActions.addAuthor({ author: submittedAuthor })
          );
        }
        dialogRef.componentInstance.authorForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  onDelete(author: Author) {
    if (
      window.confirm(
        `Are you sure to delete the record (authorName: ${author.authorName})?`
      )
    ) {
      this.store.dispatch(authorActions.deleteAuthor({ id: author.id }));
      this.loadAuthors();
    }
  }

  onPageSelect(page: PageSelectorModel) {
    this.store.dispatch(authorActions.setCurrentPage({ page: page.page }));
    this.store.dispatch(authorActions.setPageSize({ pageSize: page.limit }));
    this.loadAuthors();
  }

  private loadAuthors() {
    this.store.dispatch(authorActions.loadAuthors());
  }

  onSort(sort: SortModel) {
    this.store.dispatch(
      authorActions.setSortBy({
        sortBy: `${sort.sortColumn} ${sort.sortDirection}`,
      })
    );
    this.loadAuthors();
  }

  onFilter(searchTerm: string | null) {
    this.store.dispatch(authorActions.setSearchTerm({ searchTerm }));
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  constructor() {
    this.store.dispatch(authorActions.setCurrentPage({ page: 1 }));
    this.store.dispatch(authorActions.setPageSize({ pageSize: 10 }));
    this.loadAuthors();
  }
}
