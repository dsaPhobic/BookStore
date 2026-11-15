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
    const formData = new FormData();
    formData.append("authorName", author.authorName);
    if (author.originalName) formData.append("originalName", author.originalName);
    if (author.avatarFile) formData.append("avatarFile", author.avatarFile);
    if (author.bio) formData.append("bio", author.bio);
    if (author.nationality) formData.append("nationality", author.nationality);
    if (author.birthDate) {
      const d = new Date(author.birthDate).toISOString();
      formData.append("birthDate", d);
    }
    formData.append("isFeatured", String(!!author.isFeatured));

    return this.http.post<Author>(this.baseUrl, formData);
  }

  updateAuthor(author: Author): Observable<any> {
    const formData = new FormData();
    formData.append("id", author.id.toString());
    formData.append("authorName", author.authorName);
    if (author.originalName) formData.append("originalName", author.originalName);
    if (author.avatarFile) formData.append("avatarFile", author.avatarFile);
    if (author.avatarUrl) formData.append("avatarUrl", author.avatarUrl);
    if (author.avatarPublicId) formData.append("avatarPublicId", author.avatarPublicId);
    if (author.bio) formData.append("bio", author.bio);
    if (author.nationality) formData.append("nationality", author.nationality);
    if (author.birthDate) {
      const d = new Date(author.birthDate).toISOString();
      formData.append("birthDate", d);
    }
    formData.append("isFeatured", String(!!author.isFeatured));

    return this.http.put<any>(this.baseUrl + "/" + author.id, formData);
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

  getAuthor(id: number): Observable<Author> {
    return this.http.get<Author>(this.baseUrl + "/" + id);
  }

  getBooksByAuthor(
    authorId: number,
    pageNumber = 1,
    pageSize = 10,
    searchTerm = ""
  ): Observable<PagedList<any>> {
    let params = new HttpParams()
      .set("pageNumber", pageNumber.toString())
      .set("pageSize", pageSize.toString())
      .set("searchTerm", searchTerm);
    return this.http.get<PagedList<any>>(`${this.baseUrl}/${authorId}/books`, { params });
  }

  getAuthorStats(authorId: number): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${authorId}/stats`);
  }
}
