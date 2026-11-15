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
import { AuthorBooksDialogComponent } from "./ui/author-books-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

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
    MatIconModule,
  ],
  template: `
    <div class="header-container">
      <div>
        <h1 class="page-title">Author & Category Management (PIM)</h1>
        <p class="subtitle">Manage author profiles, Cloudinary portrait images, and book links</p>
      </div>
      <button
        type="button"
        (click)="onAddUpdate('Add', null)"
        mat-raised-button
        color="primary"
      >
        <mat-icon>add</mat-icon> Add Author
      </button>
    </div>

    <app-author-filter (filter)="onFilter($event)" />

    <ng-container *ngIf="authors$ | async as authors">
      <app-author-list
        [authors]="authors"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (sort)="onSort($event)"
        (viewBooks)="onViewBooks($event)"
      />
    </ng-container>

    <ng-container *ngIf="totalCount$ | async as totalCount">
      <app-author-paginator
        (pageSelect)="onPageSelect($event)"
        [totalRecords]="totalCount"
      />
    </ng-container>
  `,
  styles: [`
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .subtitle {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 13px;
    }
  `],
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
    this.onAddUpdate("Edit", author);
  }

  onViewBooks(author: Author) {
    this.dialog.open(AuthorBooksDialogComponent, {
      data: { author },
      width: "700px",
    });
  }

  onAddUpdate(action: string, author: Author | null = null) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      data: { author, title: action + " Author" },
      width: "560px",
    });

    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedAuthor) => {
        if (!submittedAuthor) return;
        if (submittedAuthor.id) {
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
        `Are you sure you want to delete the author "${author.authorName}"?`
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
