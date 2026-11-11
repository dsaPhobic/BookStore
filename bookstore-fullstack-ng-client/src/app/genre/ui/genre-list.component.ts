import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { GenreModel } from "../data/genre.model";

@Component({
  selector: "app-genre-list",
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <table mat-table [dataSource]="genres" class="mat-elevation-z8">
      <ng-container matColumnDef="GenreName">
        <th mat-header-cell *matHeaderCellDef>Genre Name</th>
        <td mat-cell *matCellDef="let element">
          <span class="chip chip-accent">{{ element.genreName }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="Action">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let genre">
          <div class="action-cell">
            <button
              type="button"
              (click)="edit.emit(genre)"
              mat-mini-fab
              title="Edit genre"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              type="button"
              (click)="delete.emit(genre)"
              mat-mini-fab
              color="warn"
              title="Delete genre"
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
      .action-cell {
        display: flex;
        gap: 6px;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreListComponent {
  @Input({ required: true }) genres: GenreModel[] = [];
  @Output() edit = new EventEmitter<GenreModel>();
  @Output() delete = new EventEmitter<GenreModel>();

  displayedColumns = ["GenreName", "Action"];
}
