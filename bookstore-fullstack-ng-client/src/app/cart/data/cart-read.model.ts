import { Author } from "../../authors/data/author.model";
import { GenreModel } from "../../genre/data/genre.model";

export interface CartReadModel {
  id: number;
  cartItems: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  quantity: number;
  bookId: number;
  book: BookCartModel;
}

export interface BookCartModel {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  publishedYear: number;
  authors: Author[];
  genres: GenreModel[];
  authorNames: string;
  genreNames: string;
}
