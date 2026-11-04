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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Author } from "../data/author.model";

@Component({
  selector: "app-author-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>

    <div mat-dialog-content>
      <form [formGroup]="authorForm" class="author-form">
        <input type="hidden" formControlName="id" />
        <mat-form-field appearance="fill">
          <mat-label>Author Name</mat-label>
          <input type="text" matInput formControlName="authorName" />
        </mat-form-field>

        <div mat-dialog-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="onSubmit()"
            [disabled]="authorForm.invalid"
            cdkFocusInitial
          >
            Save
          </button>
          <button mat-raised-button color="warn" (click)="onCanceled()">
            Close
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorDialogComponent {
  @Output() submit = new EventEmitter<Author>();
  authorForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    authorName: new FormControl<string>("", Validators.required),
  });

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.authorForm.valid) {
      const author: Author = Object.assign(this.authorForm.value);
      this.submit.emit(author);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<AuthorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { author: Author | null; title: string }
  ) {
    if (data.author != null) {
      this.authorForm.patchValue(data.author);
    }
  }
}
