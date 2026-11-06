import { inject, Injectable } from "@angular/core";
import { EMPTY, map, Observable, of } from "rxjs";
import { PagedList } from "../../common/paged-list.model";
import { BookCreateModel } from "./book-create.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { BookReadModel } from "./book-read.model";
interface GetBooksParams {
  pageSize: number;
  pageNumber: number;
  searchTerm: string;
  sortBy: string;
  publishedFrom: number | null;
  publishedTo: number | null;
  genreIds: Array<number>;
}

@Injectable({ providedIn: "root" })
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl + "/api/books";

  getBooks(parameters: GetBooksParams): Observable<PagedList<BookReadModel>> {
    let params = new HttpParams();
    params = params.set("pageSize", parameters.pageSize.toString());
    params = params.set("pageNumber", parameters.pageNumber.toString());
    params = params.set("searchTerm", parameters.searchTerm);
    params = params.set("sortBy", parameters.sortBy);

    parameters.genreIds.forEach((val, index) => {
      if (val) {
        params = params.append("genreIds", val);
      }
    });

    if (parameters.publishedFrom && parameters.publishedTo) {
      params = params.set("publishedFrom", parameters.publishedFrom);
      params = params.set("publishedTo", parameters.publishedTo);
    }

    return this.http
      .get<PagedList<BookReadModel>>(this.baseUrl, { params })
      .pipe(
        map((response) => ({
          ...response,
          items: response.items.map((book) => ({
            ...book,
            authorNames: book.authors
              .map((author) => author.authorName)
              .join(", ")
              .split(","),
            genreNames: book.genres
              .map((genre) => genre.genreName)
              .join(", ")
              .split(","),
          })),
        }))
      );
  }

  getBookById(id: number): Observable<BookReadModel> {
    return this.http.get<BookReadModel>(this.baseUrl + "/" + id).pipe(
      map((book) => ({
        ...book,
        authorNames: book.authors
          .map((author) => author.authorName)
          .join(", ")
          .split(","),
        genreNames: book.genres
          .map((genre) => genre.genreName)
          .join(", ")
          .split(","),
      }))
    );
  }

  addBook(book: BookCreateModel): Observable<BookReadModel> {
    const formData = new FormData();
    if (book.imageFile) {
      formData.append("imageFile", book.imageFile);
    }
    formData.append("title", book.title);
    formData.append("description", book.description);
    formData.append("price", book.price.toString());
    formData.append("publishedYear", book.publishedYear.toString());
    book.authorIds.forEach((id) => formData.append("authorIds", id.toString()));
    book.genreIds.forEach((id) => formData.append("genreIds", id.toString()));
    return this.http.post<BookReadModel>(this.baseUrl, formData).pipe(
      map((book) => ({
        ...book,
        authorNames: book.authors
          .map((author) => author.authorName)
          .join(", ")
          .split(","),
        genreNames: book.genres
          .map((genre) => genre.genreName)
          .join(", ")
          .split(","),
      }))
    );
  }

  updateBook(book: BookCreateModel): Observable<BookReadModel> {
    const formData = new FormData();
    if (book.imageFile) {
      formData.append("imageFile", book.imageFile);
    }
    formData.append("title", book.title);
    formData.append("description", book.description);
    formData.append("price", book.price.toString());
    if (book.imageUrl) {
      formData.append("imageUrl", book.imageUrl);
    }
    formData.append("publishedYear", book.publishedYear.toString());
    book.authorIds.forEach((id) => formData.append("authorIds", id.toString()));
    book.genreIds.forEach((id) => formData.append("genreIds", id.toString()));
    return this.http.put<BookReadModel>(this.baseUrl + "/" + book.id, formData);
  }

  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + "/" + id);
  }
}
