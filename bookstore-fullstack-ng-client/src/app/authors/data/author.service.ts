import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Author } from "./author.model";
import { Observable } from "rxjs";
import { AuthorCreate } from "./author-create.model";
import { PagedList } from "../../common/paged-list.model";

@Injectable({ providedIn: "root" })
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl + "/api/authors";

  addAuthor(author: AuthorCreate): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  updateAuthor(author: Author): Observable<any> {
    return this.http.put<any>(this.baseUrl + "/" + author.id, author);
  }

  deleteAuthor(id: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + "/" + id);
  }

  getAuthors({
    pageSize = 10,
    pageNumber = 1,
    searchTerm = "",
    sortBy = "",
  }): Observable<PagedList<Author>> {
    let params = new HttpParams();
    params = params.set("pageSize", pageSize.toString());
    params = params.set("pageNumber", pageNumber.toString());
    params = params.set("searchTerm", searchTerm);
    params = params.set("sortBy", sortBy);

    return this.http.get<PagedList<Author>>(this.baseUrl, { params });
  }

  getAuthor(id: number) {
    return this.http.get<Author>(this.baseUrl);
  }
}
