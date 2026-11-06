import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap } from "rxjs";
import { BookService } from "../book/Data/book.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { environment } from "../../environments/environment.development";
import { BookReadModel } from "../book/Data/book-read.model";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  selector: "app-book-detail",
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule, MatSnackBarModule],
  template: `
    <ng-container *ngIf="book$ | async as book">
      <div class="book-card">
        <img
          [src]="imageBaseUrl + book.imageUrl"
          alt="Book Cover"
          class="book-image"
        />
        <div class="book-details">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">By {{ book.authorNames }}</p>
          <p class="book-genres">Genres: {{ book.genreNames }}</p>
          <p class="book-price">At ₹{{ book.price }}</p>
          <!-- <a [href]="book.Link" class="book-link" target="_blank">Learn More</a> -->
          <a (click)="addToCart(book)" class="button book-link">Add to cart</a>
          <a routerLink="/books" class="button back-button">Back</a>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .book-card {
        background-color: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        max-width: 80%;
        margin: auto;
        padding: 25px;
      }

      .book-image {
        width: 320px;
        height: auto;
      }

      .book-details {
        padding: 16px;
      }

      .book-title {
        font-size: 50px;
        font-weight: bold;
        margin: 0;
      }

      .book-author,
      .book-country,
      .book-language,
      .book-pages,
      .book-year,
      .book-price {
        font-size: 30px;
        margin: 25px 0;
      }
      .button {
        cursor: pointer;
      }

      .book-link {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 18px 26px;
        text-decoration: none;
        border-radius: 4px;
        font-size: 30px;
        font-weight: bold;
        margin-right: 10px;
      }

      .book-link:hover {
        background-color: #0056b3;
      }

      .back-button {
        display: inline-block;
        background-color: #333;
        color: #fff;
        padding: 18px 26px;
        font-size: 30px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 16px 0;
        cursor: pointer;
      }

      .back-button:hover {
        background-color: #000;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent {
  imageBaseUrl = environment.baseUrl + "/resources/";
  route = inject(ActivatedRoute);
  store = inject(Store);
  id$ = this.route.paramMap.pipe(map((a) => a.get("id")));
  bookService = inject(BookService);
  snackBar = inject(MatSnackBar);

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

  book$ = this.id$.pipe(
    switchMap((id) => {
      if (!id) return of(null);
      return this.bookService.getBookById(parseInt(id));
    }),
    catchError((error) => {
      console.log({ "💩": error });
      return of(error);
    })
  );
}
