import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
  ChangeDetectorRef,
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
import { BookCreateModel } from "../Data/book-create.model";
import { Author } from "../../authors/data/author.model";
import { GenreModel } from "../../genre/data/genre.model";
import { NgSelectModule } from "@ng-select/ng-select";
import { Observable } from "rxjs";
import { AsyncPipe, NgIf } from "@angular/common";
import { environment } from "../../../environments/environment.development";
import { BookReadModel } from "../Data/book-read.model";

@Component({
  selector: "app-book-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    NgSelectModule,
    AsyncPipe,
    NgIf,
  ],
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>

    <div mat-dialog-content>
      <form [formGroup]="bookForm" class="book-dialog-grid">
        <input type="hidden" formControlName="id" />
        <input type="hidden" formControlName="imageUrl" />

        <!-- Left column: form inputs -->
        <div class="form-col">
          <mat-form-field appearance="outline">
            <mat-label>Book Title</mat-label>
            <input
              type="text"
              matInput
              formControlName="title"
              maxlength="30"
              placeholder="e.g. Clean Architecture"
            />
            <mat-hint align="end">
              {{ bookForm.get("title")?.value?.length || 0 }}/30
            </mat-hint>
          </mat-form-field>

          <div class="two-col">
            <mat-form-field appearance="outline">
              <mat-label>Price ($)</mat-label>
              <input
                type="number"
                matInput
                formControlName="price"
                min="0"
                step="0.01"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Published Year</mat-label>
              <input
                type="number"
                matInput
                formControlName="publishedYear"
                min="1800"
                max="2100"
              />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              rows="3"
              maxlength="200"
              formControlName="description"
              placeholder="Concise summary of the book..."
            ></textarea>
            <mat-hint align="end">
              {{ bookForm.get("description")?.value?.length || 0 }}/200
            </mat-hint>
          </mat-form-field>

          <div class="select-group">
            <label class="select-label">Authors</label>
            <ng-select
              [items]="data.authors$ | async"
              [multiple]="true"
              [closeOnSelect]="false"
              [hideSelected]="true"
              bindLabel="authorName"
              bindValue="id"
              placeholder="Select one or more authors"
              formControlName="authorIds"
              appendTo="body"
            >
            </ng-select>
          </div>

          <div class="select-group">
            <label class="select-label">Genres</label>
            <ng-select
              [items]="data.genres$ | async"
              [multiple]="true"
              [closeOnSelect]="false"
              [hideSelected]="true"
              bindLabel="genreName"
              bindValue="id"
              placeholder="Select one or more genres"
              formControlName="genreIds"
              appendTo="body"
            >
            </ng-select>
          </div>
        </div>

        <!-- Right column: Cover upload + instant preview -->
        <div class="upload-col">
          <label class="select-label">Book Cover</label>
          <label class="dropzone" for="bookCoverInput">
            <img
              *ngIf="previewUrl; else existingOrEmpty"
              [src]="previewUrl"
              alt="Preview"
              class="cover-preview"
            />
            <ng-template #existingOrEmpty>
              <img
                *ngIf="data.book?.imageUrl; else emptyDropzone"
                [src]="imageBaseUrl + data.book?.imageUrl"
                alt="Current cover"
                class="cover-preview"
              />
              <ng-template #emptyDropzone>
                <div class="dropzone-placeholder">
                  <mat-icon>cloud_upload</mat-icon>
                  <strong>Click to choose cover</strong>
                  <span>JPG, PNG, JFIF (max 1 MB)</span>
                </div>
              </ng-template>
            </ng-template>
            <input
              id="bookCoverInput"
              type="file"
              accept=".jpg,.jpeg,.png,.jfif"
              (change)="onChange($event)"
              hidden
            />
          </label>
          <span class="file-name" *ngIf="selectedFileName">
            Selected: {{ selectedFileName }}
          </span>
        </div>
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
        [disabled]="bookForm.invalid"
        cdkFocusInitial
      >
        <mat-icon>check</mat-icon>
        Save Book
      </button>
    </div>
  `,
  styles: [
    `
      .book-dialog-grid {
        display: grid;
        grid-template-columns: 1.4fr 240px;
        gap: 24px;
        padding-top: 8px;
        min-width: 640px;
      }

      .form-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      mat-form-field {
        width: 100%;
      }

      .select-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .select-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--bs-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .upload-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .dropzone {
        aspect-ratio: 3 / 4;
        border: 2px dashed var(--bs-border);
        border-radius: var(--bs-radius);
        background: var(--bs-surface-2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        transition: border-color 0.15s ease, background 0.15s ease;
      }

      .dropzone:hover {
        border-color: var(--bs-accent);
        background: var(--bs-accent-soft);
      }

      .cover-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .dropzone-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px;
        gap: 6px;
        color: var(--bs-muted);
      }

      .dropzone-placeholder .mat-icon {
        font-size: 38px;
        width: 38px;
        height: 38px;
        color: var(--bs-ink);
      }

      .dropzone-placeholder strong {
        font-size: 13px;
        color: var(--bs-ink-dark);
      }

      .dropzone-placeholder span {
        font-size: 11.5px;
      }

      .file-name {
        font-size: 12px;
        color: var(--bs-muted);
        word-break: break-all;
      }

      @media (max-width: 720px) {
        .book-dialog-grid {
          grid-template-columns: 1fr;
          min-width: auto;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent {
  @Output() submit = new EventEmitter<BookCreateModel>();
  selectedAuthors: Author[] = [];
  previewUrl: string | null = null;
  selectedFileName: string | null = null;

  bookForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    title: new FormControl<string>("", [
      Validators.required,
      Validators.maxLength(30),
    ]),
    description: new FormControl<string>("", [
      Validators.required,
      Validators.maxLength(200),
    ]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    publishedYear: new FormControl<number>(new Date().getFullYear(), [
      Validators.required,
    ]),
    authorIds: new FormControl<number[]>([], Validators.required),
    genreIds: new FormControl<number[]>([], Validators.required),
    imageUrl: new FormControl<string>(""),
    imageFile: new FormControl<File | null>(null),
  });

  imageBaseUrl = environment.baseUrl + "/resources/";

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const book: BookCreateModel = Object.assign(this.bookForm.value);
      this.submit.emit(book);
    }
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFileName = file.name;
    this.bookForm.get("imageFile")?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      book: BookReadModel | null;
      title: string;
      authors$: Observable<Array<Author>>;
      genres$: Observable<Array<GenreModel>>;
    }
  ) {
    if (data.book != null) {
      const newBookData: BookCreateModel = {
        ...data.book,
        authorIds: data.book.authors?.map((a) => a.id) ?? [],
        genreIds: data.book.genres?.map((g) => g.id) ?? [],
      };
      this.bookForm.patchValue(newBookData);
    }
  }
}
