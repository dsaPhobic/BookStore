import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CurrencyPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Author } from "../data/author.model";
import { AuthorService } from "../data/author.service";
import { getImageUrl } from "../../utils/image.utils";

@Component({
  selector: "app-author-books-dialog",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgIf,
    NgFor,
    CurrencyPipe,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      Books by: <strong>{{ data.author.authorName }}</strong>
    </h2>

    <div mat-dialog-content class="dialog-content">
      <div class="author-summary">
        <img
          *ngIf="data.author.avatarUrl"
          [src]="data.author.avatarUrl"
          alt="Avatar"
          class="author-avatar"
        />
        <div>
          <p *ngIf="data.author.originalName"><strong>Real name:</strong> {{ data.author.originalName }}</p>
          <p *ngIf="data.author.nationality"><strong>Nationality:</strong> {{ data.author.nationality }}</p>
          <p *ngIf="data.author.bio"><strong>Biography:</strong> {{ data.author.bio }}</p>
        </div>
      </div>

      <div *ngIf="loading()" class="spinner-box">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading books...</span>
      </div>

      <div *ngIf="!loading() && books().length === 0" class="empty-state">
        <p>This author has no books in the system yet.</p>
      </div>

      <table
        mat-table
        [dataSource]="books()"
        class="mat-elevation-z2 full-width"
        *ngIf="!loading() && books().length > 0"
      >
        <!-- Image Column -->
        <ng-container matColumnDef="Image">
          <th mat-header-cell *matHeaderCellDef>Cover</th>
          <td mat-cell *matCellDef="let book">
            <img
              *ngIf="book.imageUrl"
              [src]="getImageUrl(book.imageUrl)"
              alt="Cover"
              class="book-thumb"
            />
            <span *ngIf="!book.imageUrl" class="no-img">-</span>
          </td>
        </ng-container>

        <!-- Title Column -->
        <ng-container matColumnDef="Title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let book">
            <div class="book-title">{{ book.title }}</div>
            <small *ngIf="book.isbn" class="book-isbn">ISBN: {{ book.isbn }}</small>
          </td>
        </ng-container>

        <!-- Published Year Column -->
        <ng-container matColumnDef="Year">
          <th mat-header-cell *matHeaderCellDef>Published Year</th>
          <td mat-cell *matCellDef="let book">{{ book.publishedYear }}</td>
        </ng-container>

        <!-- Price Column -->
        <ng-container matColumnDef="Price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let book">{{ book.price | currency : "USD" }}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="Status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let book">
            <span class="status-badge" [class.active]="book.status === 'Active'">
              {{ book.status || 'Active' }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="dialogRef.close()">
        Close
      </button>
    </div>
  `,
  styles: [`
    .dialog-title {
      margin: 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }
    .dialog-content {
      min-width: 650px;
      max-height: 500px;
      overflow-y: auto;
      padding-top: 12px;
    }
    .author-summary {
      display: flex;
      gap: 16px;
      align-items: center;
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .author-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #3b82f6;
    }
    .full-width {
      width: 100%;
    }
    .book-thumb {
      width: 40px;
      height: 55px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      margin: 4px 0;
    }
    .book-title {
      font-weight: 500;
    }
    .book-isbn {
      color: #64748b;
      font-size: 11px;
    }
    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      background: #e2e8f0;
      color: #475569;
    }
    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }
    .spinner-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 30px;
    }
    .empty-state {
      text-align: center;
      padding: 30px;
      color: #64748b;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorBooksDialogComponent implements OnInit {
  private readonly authorService = inject(AuthorService);

  loading = signal(true);
  books = signal<any[]>([]);
  totalCount = signal(0);

  columns = ["Image", "Title", "Year", "Price", "Status"];

  getImageUrl(url?: string | null): string {
    return getImageUrl(url);
  }

  constructor(
    public dialogRef: MatDialogRef<AuthorBooksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { author: Author }
  ) {}

  ngOnInit(): void {
    this.authorService.getBooksByAuthor(this.data.author.id, 1, 50).subscribe({
      next: (res) => {
        this.books.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}

