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
        <th mat-header-cell *matHeaderCellDef>Genre</th>
        <td mat-cell *matCellDef="let element">{{ element.genreName }}</td>
      </ng-container>

      <ng-container matColumnDef="Action">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td
          mat-cell
          *matCellDef="let genre"
          style="display: flex;gap:5px;padding:5px;align-items:center;"
        >
          <button
            type="button"
            (click)="edit.emit(genre)"
            mat-mini-fab
            color="secondary"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            type="button"
            (click)="delete.emit(genre)"
            mat-mini-fab
            color="warn"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreListComponent {
  @Input({ required: true }) genres: GenreModel[] = [];
  @Output() edit = new EventEmitter<GenreModel>();
  @Output() delete = new EventEmitter<GenreModel>();

  displayedColumns = ["GenreName", "Action"];
}
