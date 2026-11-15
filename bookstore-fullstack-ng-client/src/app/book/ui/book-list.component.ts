import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { BookReadModel } from "../Data/book-read.model";
import { SortModel } from "../../common/sort.model";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { environment } from "../../../environments/environment.development";
import { CurrencyPipe, NgIf } from "@angular/common";
import { getImageUrl } from "../../utils/image.utils";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    CurrencyPipe,
    NgIf,
  ],
  template: `
    <table
      mat-table
      [dataSource]="books"
      matSort
      (matSortChange)="sortData($event)"
      class="mat-elevation-z8 full-width"
    >
      <!-- Cover Image Column (Cloudinary / Local) -->
      <ng-container matColumnDef="imageUrl">
        <th mat-header-cell *matHeaderCellDef>Cover</th>
        <td mat-cell *matCellDef="let element">
          <div class="thumb-container">
            <img
              *ngIf="element.imageUrl"
              [src]="getImageUrl(element.imageUrl)"
              alt="Book cover"
              class="book-thumb"
            />
            <div *ngIf="!element.imageUrl" class="no-thumb">
              <mat-icon>auto_stories</mat-icon>
            </div>
          </div>
        </td>
      </ng-container>

      <!-- Title & ISBN Column -->
      <ng-container matColumnDef="title">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by title"
        >
          Title & ISBN
        </th>
        <td mat-cell *matCellDef="let element">
          <div class="title-cell">
            <span class="book-title">{{ element.title }}</span>
            <div class="meta-row">
              <span *ngIf="element.isbn" class="isbn-tag">ISBN: {{ element.isbn }}</span>
              <span class="status-pill" [class.active]="element.status === 'Active'">
                {{ element.status || 'Active' }}
              </span>
            </div>
          </div>
        </td>
      </ng-container>

      <!-- Description Column -->
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let element">
          <span class="desc-text" [matTooltip]="element.description">
            {{ element.description }}
          </span>
        </td>
      </ng-container>

      <!-- Price Column -->
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>
        <td mat-cell *matCellDef="let element" class="price-cell">
          {{ element.price | currency : "USD" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="stockQuantity">
        <th mat-header-cell *matHeaderCellDef>Stock</th>
        <td mat-cell *matCellDef="let element">{{ element.stockQuantity }}</td>
      </ng-container>

      <!-- Published Year Column -->
      <ng-container matColumnDef="publishedYear">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by published year"
        >
          Published Year
        </th>
        <td mat-cell *matCellDef="let element">{{ element.publishedYear }}</td>
      </ng-container>

      <!-- Authors Column -->
      <ng-container matColumnDef="authors">
        <th mat-header-cell *matHeaderCellDef>Authors</th>
        <td mat-cell *matCellDef="let element">
          <span class="author-badge">{{ element.authorNames }}</span>
        </td>
      </ng-container>

      <!-- Genres Column -->
      <ng-container matColumnDef="genres">
        <th mat-header-cell *matHeaderCellDef>Genres</th>
        <td mat-cell *matCellDef="let element">
          <span class="genre-badge">{{ element.genreNames }}</span>
        </td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let book" class="actions-cell">
          <button
            type="button"
            (click)="edit.emit(book)"
            mat-mini-fab
            color="accent"
            matTooltip="Edit book"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            type="button"
            (click)="delete.emit(book)"
            mat-mini-fab
            color="warn"
            matTooltip="Delete book"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedCoulumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCoulumns"></tr>
    </table>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      .thumb-container {
        padding: 6px 0;
      }
      .book-thumb {
        width: 48px;
        height: 68px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        display: block;
      }
      .no-thumb {
        width: 48px;
        height: 68px;
        background: #f1f5f9;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }
      .title-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .book-title {
        font-weight: 600;
        font-size: 14px;
      }
      .meta-row {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .isbn-tag {
        font-size: 11px;
        color: #475569;
        background: #f1f5f9;
        padding: 1px 6px;
        border-radius: 4px;
        font-family: monospace;
      }
      .status-pill {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 10px;
        background: #e2e8f0;
        color: #475569;
      }
      .status-pill.active {
        background: #dcfce7;
        color: #166534;
      }
      .desc-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-width: 220px;
        font-size: 12px;
        color: #475569;
      }
      .price-cell {
        font-weight: 600;
        color: #047857;
      }
      .author-badge {
        font-size: 13px;
        color: #334155;
      }
      .genre-badge {
        background: #ede9fe;
        color: #5b21b6;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
      }
      .actions-cell {
        display: flex;
        gap: 6px;
        padding: 8px 4px;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  @Input({ required: true }) books!: ReadonlyArray<BookReadModel>;
  @Output() edit = new EventEmitter<BookReadModel>();
  @Output() delete = new EventEmitter<BookReadModel>();
  @Output() sort = new EventEmitter<SortModel>();

  imageBaseUrl = environment.baseUrl + "/resources/";

  displayedCoulumns = [
    "imageUrl",
    "title",
    "description",
    "price",
    "stockQuantity",
    "publishedYear",
    "authors",
    "genres",
    "actions",
  ];

  getImageUrl(imageUrl?: string | null): string {
    return getImageUrl(imageUrl);
  }

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
