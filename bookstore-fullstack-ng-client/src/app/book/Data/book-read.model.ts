import { Author } from "../../authors/data/author.model";
import { GenreModel } from "../../genre/data/genre.model";

export interface BookReadModel {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  publishedYear: number;
  isbn?: string | null;
  pageCount?: number | null;
  language?: string | null;
  format?: string | null;
  publisher?: string | null;
  status?: string | null;
  createdAt?: string;
  authors: Author[];
  genres: GenreModel[];
  authorNames: Array<string>;
  genreNames: Array<string>;
}
