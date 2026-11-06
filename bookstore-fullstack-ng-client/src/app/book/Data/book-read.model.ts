import { Author } from "../../authors/data/author.model";
import { GenreModel } from "../../genre/data/genre.model";

export interface BookReadModel {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: null;
  publishedYear: number;
  authors: Author[];
  genres: GenreModel[];
  authorNames: Array<string>;
  genreNames: Array<string>;
}
