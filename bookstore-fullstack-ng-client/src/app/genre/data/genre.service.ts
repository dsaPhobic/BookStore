import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { GenreModel } from "./genre.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  private baseUrl = `${environment.baseUrl}/api/genres`;
  private http = inject(HttpClient);
  addGenre(genre: GenreModel): Observable<GenreModel> {
    return this.http.post<GenreModel>(this.baseUrl, genre);
  }

  updateGenre(genre: GenreModel): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${genre.id}`, genre);
  }

  getGenres(): Observable<GenreModel[]> {
    return this.http.get<GenreModel[]>(this.baseUrl);
  }

  getGenreById(id: number): Observable<GenreModel> {
    return this.http.get<GenreModel>(`${this.baseUrl}/${id}`);
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
