import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  inject,
  Output,
  signal,
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
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { BookCreateModel } from "../Data/book-create.model";
import { Author } from "../../authors/data/author.model";
import { GenreModel } from "../../genre/data/genre.model";
import { NgSelectModule } from "@ng-select/ng-select";
import { Observable } from "rxjs";
import { AsyncPipe, NgIf } from "@angular/common";
import { environment } from "../../../environments/environment.development";
import { BookReadModel } from "../Data/book-read.model";
import { BookService } from "../Data/book.service";
import { getImageUrl } from "../../utils/image.utils";

@Component({
  selector: "app-book-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgSelectModule,
    AsyncPipe,
    NgIf,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      {{ data.title }}
    </h2>

    <div mat-dialog-content>
      <!-- ISBN Lookup Bar (Smart Autofill) -->
      <div class="isbn-lookup-box">
        <div class="lookup-input-group">
          <mat-form-field appearance="outline" class="isbn-field">
            <mat-label>ISBN (10 or 13 digits)</mat-label>
            <input
              type="text"
              matInput
              [formControl]="isbnLookupControl"
              placeholder="e.g. 9780132350884, 9780131495050"
            />
          </mat-form-field>
          <button
            type="button"
            mat-raised-button
            color="accent"
            class="lookup-btn"
            (click)="onLookupIsbn()"
            [disabled]="isLookingUp() || !isbnLookupControl.value"
          >
            <mat-spinner diameter="18" *ngIf="isLookingUp()"></mat-spinner>
            <mat-icon *ngIf="!isLookingUp()">search</mat-icon>
            Auto lookup via Google Books
          </button>
        </div>
        <div *ngIf="lookupMessage()" class="lookup-msg" [class.success]="lookupSuccess()">
          {{ lookupMessage() }}
        </div>
      </div>

      <form [formGroup]="bookForm" class="book-form">
        <input type="hidden" formControlName="id" />
        <input type="hidden" formControlName="imageUrl" />
        <input type="hidden" formControlName="imagePublicId" />

        <!-- Title -->
        <mat-form-field appearance="fill" class="col-span-2">
          <mat-label>Title *</mat-label>
          <input type="text" matInput formControlName="title" />
        </mat-form-field>

        <!-- ISBN -->
        <mat-form-field appearance="fill">
          <mat-label>ISBN</mat-label>
          <input type="text" matInput formControlName="isbn" />
        </mat-form-field>

        <!-- Price -->
        <mat-form-field appearance="fill">
          <mat-label>Price (USD) *</mat-label>
          <input type="number" matInput formControlName="price" />
        </mat-form-field>

        <!-- Published Year -->
        <mat-form-field appearance="fill">
          <mat-label>Published Year *</mat-label>
          <input type="number" matInput formControlName="publishedYear" />
        </mat-form-field>

        <!-- Page Count -->
        <mat-form-field appearance="fill">
          <mat-label>Page Count</mat-label>
          <input type="number" matInput formControlName="pageCount" />
        </mat-form-field>

        <!-- Language -->
        <mat-form-field appearance="fill">
          <mat-label>Language</mat-label>
          <input type="text" matInput formControlName="language" placeholder="English, Vietnamese..." />
        </mat-form-field>

        <!-- Format -->
        <mat-form-field appearance="fill">
          <mat-label>Format</mat-label>
          <mat-select formControlName="format">
            <mat-option value="Paperback">Paperback</mat-option>
            <mat-option value="Hardcover">Hardcover</mat-option>
            <mat-option value="E-Book">E-Book</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Publisher -->
        <mat-form-field appearance="fill">
          <mat-label>Publisher</mat-label>
          <input type="text" matInput formControlName="publisher" />
        </mat-form-field>

        <!-- Status -->
        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Draft">Draft</mat-option>
            <mat-option value="Archived">Archived</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Description -->
        <mat-form-field appearance="fill" class="col-span-3">
          <mat-label>Short Description *</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <!-- Authors Multi-select -->
        <div class="col-span-1-5">
          <label class="select-label">Authors *</label>
          <ng-select
            [items]="authorsList"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="authorName"
            bindValue="id"
            placeholder="Select authors..."
            formControlName="authorIds"
          >
          </ng-select>
        </div>

        <!-- Genres Multi-select -->
        <div class="col-span-1-5">
          <label class="select-label">Genres *</label>
          <ng-select
            [items]="genresList"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="genreName"
            bindValue="id"
            placeholder="Select genres..."
            formControlName="genreIds"
          >
          </ng-select>
        </div>

        <!-- Cloudinary Image Upload & Preview -->
        <div class="image-upload-card col-span-3">
          <div class="image-preview-wrapper">
            <img
              *ngIf="previewImageUrl"
              [src]="previewImageUrl"
              alt="Book cover"
              class="book-cover-preview"
            />
            <div *ngIf="!previewImageUrl" class="cover-placeholder">
              <mat-icon>image</mat-icon>
              <span>No cover image</span>
            </div>
          </div>
          <div class="image-upload-controls">
            <label class="upload-btn-label">Upload book cover (Cloudinary CDN):</label>
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
            <small class="upload-note">Images are automatically cropped and optimized to WebP/AVIF on Cloudinary.</small>
          </div>
        </div>

        <div mat-dialog-actions align="end" class="col-span-3 actions-bar">
          <button mat-button (click)="onCanceled()">Cancel</button>
          <button
            mat-raised-button
            color="primary"
            (click)="onSubmit()"
            [disabled]="bookForm.invalid"
            cdkFocusInitial
          >
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .dialog-title {
        margin: 0;
        font-weight: 600;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
      }

      .isbn-lookup-box {
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .lookup-input-group {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .isbn-field {
        flex: 1;
        margin-bottom: -1.25em;
      }

      .lookup-btn {
        height: 52px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .lookup-msg {
        font-size: 12px;
        margin-top: 8px;
        color: #e11d48;
      }

      .lookup-msg.success {
        color: #16a34a;
        font-weight: 500;
      }

      .book-form {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        min-width: 720px;
      }

      .col-span-2 {
        grid-column: span 2;
      }

      .col-span-3 {
        grid-column: span 3;
      }

      .col-span-1-5 {
        grid-column: span 1.5;
      }

      .select-label {
        font-size: 12px;
        font-weight: 500;
        color: #475569;
        margin-bottom: 4px;
        display: block;
      }

      .image-upload-card {
        display: flex;
        align-items: center;
        gap: 20px;
        background: #f1f5f9;
        border-radius: 8px;
        padding: 12px;
        margin-top: 8px;
      }

      .image-preview-wrapper {
        width: 70px;
        height: 95px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .book-cover-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10px;
        color: #94a3b8;
      }

      .image-upload-controls {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .upload-btn-label {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
      }

      .upload-note {
        font-size: 11px;
        color: #64748b;
      }

      .actions-bar {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent {
  private readonly bookService = inject(BookService);

  @Output() submit = new EventEmitter<BookCreateModel>();

  isLookingUp = signal(false);
  lookupMessage = signal("");
  lookupSuccess = signal(false);

  previewImageUrl: string | null = null;
  selectedImageFile: File | null = null;

  authorsList: Author[] = [];
  genresList: GenreModel[] = [];

  isbnLookupControl = new FormControl<string>("");

  bookForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    title: new FormControl<string>("", Validators.required),
    description: new FormControl<string>("", Validators.required),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    publishedYear: new FormControl<number>(new Date().getFullYear(), Validators.required),
    isbn: new FormControl<string>(""),
    pageCount: new FormControl<number | null>(null),
    language: new FormControl<string>("English"),
    format: new FormControl<string>("Paperback"),
    publisher: new FormControl<string>(""),
    status: new FormControl<string>("Active"),
    authorIds: new FormControl<number[]>([], Validators.required),
    genreIds: new FormControl<number[]>([], Validators.required),
    imageUrl: new FormControl<string>(""),
    imagePublicId: new FormControl<string>(""),
  });

  imageBaseUrl = environment.baseUrl + "/resources/";

  onLookupIsbn() {
    const isbn = this.isbnLookupControl.value?.trim();
    if (!isbn) return;

    this.isLookingUp.set(true);
    this.lookupMessage.set("Searching Google Books...");
    this.lookupSuccess.set(false);

    this.bookService.lookupIsbn(isbn).subscribe({
      next: (res) => {
        this.isLookingUp.set(false);
        if (res && res.found) {
          this.lookupSuccess.set(true);

          const authorNames = (res.authors || []).join(", ");
          const authorMsg = authorNames ? ` (Authors: ${authorNames})` : "";
          this.lookupMessage.set(`Found book: "${res.title}"${authorMsg}! Details and authors have been filled in automatically.`);

          this.bookForm.patchValue({
            isbn: res.isbn || isbn,
            title: res.title || this.bookForm.get("title")?.value,
            description: res.description || this.bookForm.get("description")?.value,
            publishedYear: res.publishedYear || this.bookForm.get("publishedYear")?.value,
            pageCount: res.pageCount || null,
            language: res.language || this.bookForm.get("language")?.value,
            publisher: res.publisher || this.bookForm.get("publisher")?.value,
          });

          // Handle automatic author selection
          const matchedAuthorIds: number[] = [];
          if (res.matchedAuthors && res.matchedAuthors.length > 0) {
            for (const ma of res.matchedAuthors) {
              if (!this.authorsList.some((a) => a.id === ma.id)) {
                this.authorsList = [...this.authorsList, { id: ma.id, authorName: ma.authorName }];
              }
              matchedAuthorIds.push(ma.id);
            }
          } else if (res.authorIds && res.authorIds.length > 0) {
            matchedAuthorIds.push(...res.authorIds);
          } else if (res.authors && res.authors.length > 0) {
            for (const name of res.authors) {
              const trimmed = name.trim().toLowerCase();
              const found = this.authorsList.find(
                (a) => a.authorName.toLowerCase() === trimmed
              );
              if (found && !matchedAuthorIds.includes(found.id)) {
                matchedAuthorIds.push(found.id);
              }
            }
          }

          if (matchedAuthorIds.length > 0) {
            this.bookForm.get("authorIds")?.setValue(matchedAuthorIds);
          }

          if (res.imageUrl) {
            this.previewImageUrl = res.imageUrl;
            this.bookForm.get("imageUrl")?.setValue(res.imageUrl);
          }
        } else {
          this.lookupSuccess.set(false);
          this.lookupMessage.set("No information found on Google Books for this ISBN. Please enter the details manually.");
        }
      },
      error: () => {
        this.isLookingUp.set(false);
        this.lookupSuccess.set(false);
        this.lookupMessage.set("Connection error while looking up ISBN.");
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formVal = this.bookForm.value;
      const book: BookCreateModel = {
        ...formVal,
        imageFile: this.selectedImageFile,
      };
      this.submit.emit(book);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      book: BookReadModel | null;
      title: string;
      authors$: Observable<Array<Author>>;
      genres$: Observable<Array<GenreModel>>;
    }
  ) {
    if (this.data.authors$) {
      this.data.authors$.subscribe((authors) => {
        this.authorsList = [...(authors || [])];
      });
    }
    if (this.data.genres$) {
      this.data.genres$.subscribe((genres) => {
        this.genresList = [...(genres || [])];
      });
    }

    if (data.book != null) {
      const b = data.book;
      const authorIds = (b.authors || []).map((a) => a.id);
      const genreIds = (b.genres || []).map((g) => g.id);

      this.bookForm.patchValue({
        id: b.id,
        title: b.title,
        description: b.description,
        price: b.price,
        publishedYear: b.publishedYear,
        isbn: b.isbn || "",
        pageCount: b.pageCount || null,
        language: b.language || "English",
        format: b.format || "Paperback",
        publisher: b.publisher || "",
        status: b.status || "Active",
        imageUrl: b.imageUrl || "",
        imagePublicId: b.imagePublicId || "",
        authorIds,
        genreIds,
      });

      if (b.isbn) {
        this.isbnLookupControl.setValue(b.isbn);
      }

      if (b.imageUrl) {
        this.previewImageUrl = getImageUrl(b.imageUrl);
      }
    }
  }
}
