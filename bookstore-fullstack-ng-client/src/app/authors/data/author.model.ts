export interface Author {
  id: number;
  authorName: string;
  originalName?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  avatarFile?: File | null;
  bio?: string;
  birthDate?: string | Date;
  nationality?: string;
  isFeatured?: boolean;
  createdAt?: string;
  booksCount?: number;
}
