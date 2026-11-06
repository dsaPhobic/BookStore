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
import { NgIf } from "@angular/common";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    NgIf,
  ],
  template: `
    <table
      mat-table
      [dataSource]="books"
      matSort
      (matSortChange)="sortData($event)"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="title">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by title"
        >
          Title
        </th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>
      <ng-container matColumnDef="imageUrl">
        <th mat-header-cell *matHeaderCellDef>Image</th>
        <td mat-cell *matCellDef="let element">
          <img
            style="height: 80px;width:100px;"
            *ngIf="element.imageUrl"
            [src]="this.imageBaseUrl + element.imageUrl"
            alt="image"
          />
        </td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let element">{{ element.description }}</td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let element">{{ element.price }}</td>
      </ng-container>

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

      <ng-container matColumnDef="genres">
        <th mat-header-cell *matHeaderCellDef>Genres</th>
        <td mat-cell *matCellDef="let element">{{ element.genreNames }}</td>
      </ng-container>

      <ng-container matColumnDef="authors">
        <th mat-header-cell *matHeaderCellDef>Authors</th>
        <td mat-cell *matCellDef="let element">{{ element.authorNames }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td
          mat-cell
          *matCellDef="let book"
          style="display: flex;gap:5px;padding:5px;align-items:center;"
        >
          <button
            type="button"
            (click)="edit.emit(book)"
            mat-mini-fab
            color="secondary"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            type="button"
            (click)="delete.emit(book)"
            mat-mini-fab
            color="warn"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedCoulumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCoulumns"></tr>
    </table>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  @Input({ required: true }) books!: ReadonlyArray<BookReadModel>;
  @Output() edit = new EventEmitter<BookReadModel>();
  @Output() delete = new EventEmitter<BookReadModel>();
  @Output() sort = new EventEmitter<SortModel>();
  imageBaseUrl = environment.baseUrl + "/resources/";

  displayedCoulumns = [
    "title",
    "imageUrl",
    "description",
    "price",
    "publishedYear",
    "authors",
    "genres",
    "actions",
  ];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
