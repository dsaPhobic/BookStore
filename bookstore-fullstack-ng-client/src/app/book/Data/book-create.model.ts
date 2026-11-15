export interface BookCreateModel {
  id: number;
  title: string;
  description: string;
  price: number;
  publishedYear: number;
  authorIds: number[];
  genreIds: number[];
  imageFile?: File | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isbn?: string | null;
  pageCount?: number | null;
  language?: string | null;
  format?: string | null;
  publisher?: string | null;
  status?: string | null;
}
