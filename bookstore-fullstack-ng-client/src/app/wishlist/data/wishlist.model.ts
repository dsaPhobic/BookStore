import { BookReadModel } from "../../book/Data/book-read.model";

export interface WishlistItem {
  id: number;
  createdAt: string;
  book: BookReadModel;
}
