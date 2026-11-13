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
import { MatIconModule } from "@angular/material/icon";
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
    MatIconModule,
  ],
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>

    <div mat-dialog-content>
      <form [formGroup]="authorForm" class="dialog-form">
        <input type="hidden" formControlName="id" />
        <mat-form-field appearance="outline">
          <mat-label>Author Name</mat-label>
          <input
            type="text"
            matInput
            maxlength="30"
            placeholder="e.g. Martin Fowler"
            formControlName="authorName"
          />
          <mat-hint align="end">
            {{ authorForm.get("authorName")?.value?.length || 0 }}/30
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
        [disabled]="authorForm.invalid"
        cdkFocusInitial
      >
        <mat-icon>check</mat-icon>
        Save Author
      </button>
    </div>
  `,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorDialogComponent {
  @Output() submit = new EventEmitter<Author>();
  authorForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    authorName: new FormControl<string>("", [
      Validators.required,
      Validators.maxLength(30),
    ]),
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
