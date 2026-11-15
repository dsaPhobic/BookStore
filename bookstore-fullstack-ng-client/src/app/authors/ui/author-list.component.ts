import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Author } from "../data/author.model";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SortModel } from "../../common/sort.model";
import { MatSortModule, Sort } from "@angular/material/sort";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-author-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    NgIf,
  ],
  template: `
    <table
      mat-table
      [dataSource]="authors"
      matSort
      (matSortChange)="sortData($event)"
      class="mat-elevation-z8 full-width"
    >
      <!-- Avatar Column -->
      <ng-container matColumnDef="Avatar">
        <th mat-header-cell *matHeaderCellDef>Ảnh</th>
        <td mat-cell *matCellDef="let element">
          <div class="avatar-cell">
            <img
              *ngIf="element.avatarUrl"
              [src]="element.avatarUrl"
              alt="Avatar"
              class="avatar-thumb"
            />
            <div *ngIf="!element.avatarUrl" class="avatar-initial">
              {{ element.authorName ? element.authorName.charAt(0).toUpperCase() : 'A' }}
            </div>
          </div>
        </td>
      </ng-container>

      <!-- Author Name Column -->
      <ng-container matColumnDef="AuthorName">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by author name"
        >
          Tên tác giả
        </th>
        <td mat-cell *matCellDef="let element">
          <div class="name-container">
            <span class="main-name">{{ element.authorName }}</span>
            <span *ngIf="element.isFeatured" class="featured-badge" matTooltip="Tác giả nổi bật">
              ⭐ Nổi bật
            </span>
          </div>
          <small *ngIf="element.originalName" class="sub-name">
            ({{ element.originalName }})
          </small>
        </td>
      </ng-container>

      <!-- Nationality Column -->
      <ng-container matColumnDef="Nationality">
        <th mat-header-cell *matHeaderCellDef>Quốc tịch</th>
        <td mat-cell *matCellDef="let element">
          {{ element.nationality || '-' }}
        </td>
      </ng-container>

      <!-- Books Count Column -->
      <ng-container matColumnDef="BooksCount">
        <th mat-header-cell *matHeaderCellDef>Số đầu sách</th>
        <td mat-cell *matCellDef="let element">
          <span class="count-badge" (click)="viewBooks.emit(element)">
            📚 {{ element.booksCount || 0 }} sách
          </span>
        </td>
      </ng-container>

      <!-- Action Column -->
      <ng-container matColumnDef="Action">
        <th mat-header-cell *matHeaderCellDef>Thao tác</th>
        <td mat-cell *matCellDef="let author" class="action-cell">
          <button
            type="button"
            (click)="viewBooks.emit(author)"
            mat-mini-fab
            color="primary"
            matTooltip="Xem danh mục sách của tác giả"
          >
            <mat-icon>menu_book</mat-icon>
          </button>
          <button
            type="button"
            (click)="edit.emit(author)"
            mat-mini-fab
            color="accent"
            matTooltip="Chỉnh sửa tác giả"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            type="button"
            (click)="delete.emit(author)"
            mat-mini-fab
            color="warn"
            matTooltip="Xóa tác giả"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    .avatar-cell {
      padding: 6px 0;
    }
    .avatar-thumb {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }
    .avatar-initial {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #e0e7ff;
      color: #4338ca;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
    .name-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .main-name {
      font-weight: 500;
      font-size: 14px;
    }
    .sub-name {
      color: #64748b;
      font-size: 12px;
      display: block;
    }
    .featured-badge {
      background: #fef3c7;
      color: #92400e;
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      font-weight: 500;
    }
    .count-badge {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .count-badge:hover {
      background: #dcfce7;
      transform: scale(1.05);
    }
    .action-cell {
      display: flex;
      gap: 8px;
      padding: 8px 4px;
      align-items: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorListComponent {
  @Input({ required: true }) authors!: readonly Author[];
  @Output() edit = new EventEmitter<Author>();
  @Output() delete = new EventEmitter<Author>();
  @Output() sort = new EventEmitter<SortModel>();
  @Output() viewBooks = new EventEmitter<Author>();

  displayedColumns = ["Avatar", "AuthorName", "Nationality", "BooksCount", "Action"];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
