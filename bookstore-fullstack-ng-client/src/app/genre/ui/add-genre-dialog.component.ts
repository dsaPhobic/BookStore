import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { GenreModel } from "../data/genre.model";

@Component({
  selector: "app-add-genre-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  styles: [
    `
      .dialog-form {
        padding-top: 8px;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="genreForm" class="dialog-form">
        <input formControlName="id" type="hidden" />

        <mat-form-field appearance="outline">
          <mat-label>Genre Name</mat-label>
          <input
            matInput
            maxlength="30"
            placeholder="e.g. Software Architecture"
            formControlName="genreName"
          />
          <mat-hint align="end">
            {{ genreForm.get("genreName")?.value?.length || 0 }}/30
          </mat-hint>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="onCanceled()">
        Cancel
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        (click)="onSubmit()"
        [disabled]="genreForm.invalid"
        cdkFocusInitial
      >
        <mat-icon>check</mat-icon>
        Save Genre
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGenreDialogComponent {
  @Output() submit = new EventEmitter<GenreModel>();

  genreForm = new FormGroup({
    id: new FormControl<number>(0),
    genreName: new FormControl<string>("", [
      Validators.required,
      Validators.maxLength(30),
    ]),
  });

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.genreForm.valid) {
      const genre: GenreModel = Object.assign(this.genreForm.value);
      this.submit.emit(genre);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<AddGenreDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { genre: GenreModel | null; title: string }
  ) {
    if (data.genre != null) {
      this.genreForm.patchValue(data.genre);
    }
  }
}
