import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BookReadModel } from "../../book/Data/book-read.model";

export interface PublicBookQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  genreIds: ReadonlyArray<number>;
  publishedFrom: number | null;
  publishedTo: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export type PublicBookFilters = Pick<
  PublicBookQuery,
  | "searchTerm"
  | "sortBy"
  | "genreIds"
  | "publishedFrom"
  | "publishedTo"
  | "minPrice"
  | "maxPrice"
>;

export interface PublicBookPage {
  items: ReadonlyArray<BookReadModel>;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

@Injectable({ providedIn: "root" })
export class PublicBookService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/api/books`;

  getBooks(query: PublicBookQuery): Observable<PublicBookPage> {
    let params = new HttpParams()
      .set("pageNumber", query.pageNumber)
      .set("pageSize", query.pageSize);

    if (query.searchTerm.trim()) {
      params = params.set("searchTerm", query.searchTerm.trim());
    }

    if (query.sortBy) {
      params = params.set("sortBy", query.sortBy);
    }

    for (const genreId of query.genreIds) {
      params = params.append("genreIds", genreId);
    }

    params = this.setOptionalNumber(params, "publishedFrom", query.publishedFrom);
    params = this.setOptionalNumber(params, "publishedTo", query.publishedTo);
    params = this.setOptionalNumber(params, "minPrice", query.minPrice);
    params = this.setOptionalNumber(params, "maxPrice", query.maxPrice);

    return this.http.get<PublicBookPage>(this.baseUrl, { params }).pipe(
      map((page) => ({
        ...page,
        items: page.items.map((book) => ({
          ...book,
          authorNames: book.authors.map((author) => author.authorName),
          genreNames: book.genres.map((genre) => genre.genreName),
        })),
      }))
    );
  }

  private setOptionalNumber(
    params: HttpParams,
    key: string,
    value: number | null
  ): HttpParams {
    return value === null ? params : params.set(key, value);
  }
}
