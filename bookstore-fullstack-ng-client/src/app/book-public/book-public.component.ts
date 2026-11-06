import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from "@angular/core";
import { BookReadModel } from "../book/Data/book-read.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import {
  selectBookError,
  selectBookLoading,
  selectBooks,
} from "../book/state/book.selectors";
import { Subject } from "rxjs";
import { BookListPublicComponent } from "./ui/book-list-public.component";
import { BookActions } from "../book/state/book.actions";
import { BookPublicFilterComponent } from "./ui/book-public-filter.component";
import { GenreActions } from "../genre/state/genre.actions";
import { selectGenres } from "../genre/state/genre.selectors";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";

@Component({
  selector: "app-book-public",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    BookListPublicComponent,
    BookPublicFilterComponent,
  ],
  template: `
    <ng-container *ngIf="loading$ | async as loading">
      loading...
    </ng-container>
    <ng-container *ngIf="error$ | async as error"> error.. </ng-container>

    <ng-container *ngIf="genres$ | async as genres">
      <app-book-public-filter
        [genres]="genres"
        (onSearch)="handleSearch($event)"
        (onGenreSelect)="handleOnGenreSelect($event)"
      />
    </ng-container>

    <ng-container *ngIf="books$ | async as books">
      <app-book-list-public
        [books]="books"
        (addToCart)="addToCart($event)"
      ></app-book-list-public>
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPublicComponent implements OnDestroy {
  snackBar = inject(MatSnackBar);
  store = inject(Store);
  books$ = this.store.select(selectBooks);
  loading$ = this.store.select(selectBookLoading);
  error$ = this.store.select(selectBookError);
  destroy$ = new Subject<boolean>();
  genres$ = this.store.select(selectGenres);

  addToCart(book: BookReadModel) {
    const cartItem: CartCreateModel = {
      bookId: book.id,
      quantity: 1,
    };
    this.store.dispatch(CartActions.addCartItem({ cartItem }));
    this.snackBar.open(`${book.title} added to cart`, "", {
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleSearch(searchTerm: string | null) {
    this.store.dispatch(BookActions.setSearchTerm({ searchTerm }));
    this.store.dispatch(BookActions.loadBooks());
  }

  handleOnGenreSelect(genreIds: Array<number>) {
    this.store.dispatch(BookActions.setGenreIds({ genreIds }));
    this.loadBooks();
  }

  loadBooks() {
    this.store.dispatch(BookActions.loadBooks());
  }

  constructor() {
    this.store.dispatch(BookActions.setPageSize({ pageSize: 1000 }));
    this.store.dispatch(GenreActions.loadGenre());
    this.loadBooks();
  }
}
