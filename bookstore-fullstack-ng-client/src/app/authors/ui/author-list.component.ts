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
import { SortModel } from "../../common/sort.model";
import { MatSortModule, Sort } from "@angular/material/sort";

@Component({
  selector: "app-author-list",
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule],
  template: `
    <table
      mat-table
      [dataSource]="authors"
      matSort
      (matSortChange)="sortData($event)"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="AuthorName">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by author name"
        >
          Author Name
        </th>
        <td mat-cell *matCellDef="let element">
          <div class="author-cell">
            <span class="author-badge">
              {{ element.authorName?.charAt(0) || "A" }}
            </span>
            <strong>{{ element.authorName }}</strong>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="Action">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let author">
          <div class="action-cell">
            <button
              type="button"
              (click)="edit.emit(author)"
              mat-mini-fab
              title="Edit author"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              type="button"
              (click)="delete.emit(author)"
              mat-mini-fab
              color="warn"
              title="Delete author"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      .author-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .author-badge {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
        display: grid;
        place-items: center;
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
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
export class AuthorListComponent {
  @Input({ required: true }) authors!: readonly Author[];
  @Output() edit = new EventEmitter<Author>();
  @Output() delete = new EventEmitter<Author>();
  @Output() sort = new EventEmitter<SortModel>();

  displayedColumns = ["AuthorName", "Action"];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
