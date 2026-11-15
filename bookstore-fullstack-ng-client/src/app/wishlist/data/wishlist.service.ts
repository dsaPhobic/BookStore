import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BookReadModel } from "../../book/Data/book-read.model";
import { WishlistItem } from "./wishlist.model";

@Injectable({ providedIn: "root" })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/api/wishlist`;

  getWishlist(): Observable<ReadonlyArray<WishlistItem>> {
    return this.http
      .get<ReadonlyArray<WishlistItem>>(this.baseUrl)
      .pipe(map((items) => items.map((item) => this.enrichItem(item))));
  }

  addBook(bookId: number): Observable<WishlistItem> {
    return this.http
      .post<WishlistItem>(`${this.baseUrl}/${bookId}`, {})
      .pipe(map((item) => this.enrichItem(item)));
  }

  removeBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${bookId}`);
  }

  private enrichItem(item: WishlistItem): WishlistItem {
    return { ...item, book: this.enrichBook(item.book) };
  }

  private enrichBook(book: BookReadModel): BookReadModel {
    return {
      ...book,
      authorNames: book.authors.map((author) => author.authorName),
      genreNames: book.genres.map((genre) => genre.genreName),
    };
  }
}
