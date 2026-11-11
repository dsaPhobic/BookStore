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
import { environment } from "../../../environments/environment.development";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    NgIf,
    NgFor,
  ],
  template: `
    <table
      mat-table
      [dataSource]="books"
      matSort
      (matSortChange)="sortData($event)"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="imageUrl">
        <th mat-header-cell *matHeaderCellDef>Cover</th>
        <td mat-cell *matCellDef="let element">
          <div class="thumb-wrap">
            <img
              *ngIf="element.imageUrl; else noThumb"
              [src]="this.imageBaseUrl + element.imageUrl"
              [alt]="element.title"
              class="thumb-img"
            />
            <ng-template #noThumb>
              <mat-icon>menu_book</mat-icon>
            </ng-template>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by title"
        >
          Book Title
        </th>
        <td mat-cell *matCellDef="let element">
          <div class="book-title-cell">{{ element.title }}</div>
          <div class="book-desc-cell">{{ element.description }}</div>
        </td>
      </ng-container>

      <ng-container matColumnDef="authors">
        <th mat-header-cell *matHeaderCellDef>Authors</th>
        <td mat-cell *matCellDef="let element">
          <div class="chip-wrap">
            <span class="chip" *ngFor="let a of element.authors">
              {{ a.authorName }}
            </span>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="genres">
        <th mat-header-cell *matHeaderCellDef>Genres</th>
        <td mat-cell *matCellDef="let element">
          <div class="chip-wrap">
            <span class="chip chip-accent" *ngFor="let g of element.genres">
              {{ g.genreName }}
            </span>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="publishedYear">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by published year"
        >
          Year
        </th>
        <td mat-cell *matCellDef="let element">{{ element.publishedYear }}</td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let element">
          <span class="price">\${{ element.price }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let book">
          <div class="action-cell">
            <button
              type="button"
              (click)="edit.emit(book)"
              mat-mini-fab
              title="Edit book"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              type="button"
              (click)="delete.emit(book)"
              mat-mini-fab
              color="warn"
              title="Delete book"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedCoulumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCoulumns"></tr>
    </table>
  `,
  styles: [
    `
      .thumb-wrap {
        width: 48px;
        height: 64px;
        border-radius: 6px;
        overflow: hidden;
        background: var(--bs-surface-2);
        border: 1px solid var(--bs-border);
        display: grid;
        place-items: center;
        margin: 8px 0;
      }

      .thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .book-title-cell {
        font-weight: 600;
        color: var(--bs-ink-dark);
      }

      .book-desc-cell {
        font-size: 12.5px;
        color: var(--bs-muted);
        max-width: 320px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chip-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }

      .action-cell {
        display: flex;
        gap: 6px;
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
    "authors",
    "genres",
    "publishedYear",
    "price",
    "actions",
  ];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
