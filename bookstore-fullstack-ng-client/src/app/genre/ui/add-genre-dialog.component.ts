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
  ],
  styles: [``],
  template: `
    <h1 mat-dialog-title>Add Genre</h1>
    <div mat-dialog-content>
      <form [formGroup]="genreForm">
        <input formControlName="id" type="hidden" />

        <mat-form-field appearance="fill">
          <mat-label>Genre</mat-label>
          <input matInput placeholder="Genre" formControlName="genreName" />
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="genreForm.invalid"
        cdkFocusInitial
      >
        Save
      </button>
      <button mat-raised-button color="warn" (click)="onCanceled()">
        Close
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGenreDialogComponent {
  @Output() submit = new EventEmitter<GenreModel>();

  genreForm = new FormGroup({
    id: new FormControl<number>(0),
    genreName: new FormControl<string>("", Validators.required),
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
    // case : edit
    //  if genre is not null, then set the form control values.Which indicates that user has pressed the edit button.
    if (data.genre != null) {
      this.genreForm.patchValue(data.genre);
    }
  }
}
