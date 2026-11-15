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
            <mat-label>Mã ISBN (10 hoặc 13 chữ số)</mat-label>
            <input
              type="text"
              matInput
              [formControl]="isbnLookupControl"
              placeholder="VD: 9780132350884, 9780131495050"
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
            Tra cứu tự động qua Google Books
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
          <mat-label>Tựa sách (Title) *</mat-label>
          <input type="text" matInput formControlName="title" />
        </mat-form-field>

        <!-- ISBN -->
        <mat-form-field appearance="fill">
          <mat-label>ISBN</mat-label>
          <input type="text" matInput formControlName="isbn" />
        </mat-form-field>

        <!-- Price -->
        <mat-form-field appearance="fill">
          <mat-label>Giá bán (VNĐ) *</mat-label>
          <input type="number" matInput formControlName="price" />
        </mat-form-field>

        <!-- Published Year -->
        <mat-form-field appearance="fill">
          <mat-label>Năm xuất bản *</mat-label>
          <input type="number" matInput formControlName="publishedYear" />
        </mat-form-field>

        <!-- Page Count -->
        <mat-form-field appearance="fill">
          <mat-label>Số trang</mat-label>
          <input type="number" matInput formControlName="pageCount" />
        </mat-form-field>

        <!-- Language -->
        <mat-form-field appearance="fill">
          <mat-label>Ngôn ngữ</mat-label>
          <input type="text" matInput formControlName="language" placeholder="Tiếng Việt, English..." />
        </mat-form-field>

        <!-- Format -->
        <mat-form-field appearance="fill">
          <mat-label>Định dạng bìa</mat-label>
          <mat-select formControlName="format">
            <mat-option value="Paperback">Bìa mềm (Paperback)</mat-option>
            <mat-option value="Hardcover">Bìa cứng (Hardcover)</mat-option>
            <mat-option value="E-Book">Sách điện tử (E-Book)</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Publisher -->
        <mat-form-field appearance="fill">
          <mat-label>Nhà xuất bản</mat-label>
          <input type="text" matInput formControlName="publisher" />
        </mat-form-field>

        <!-- Status -->
        <mat-form-field appearance="fill">
          <mat-label>Trạng thái</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Đang kinh doanh (Active)</mat-option>
            <mat-option value="Draft">Bản nháp (Draft)</mat-option>
            <mat-option value="Archived">Ngừng kinh doanh (Archived)</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Description -->
        <mat-form-field appearance="fill" class="col-span-3">
          <mat-label>Mô tả nội dung tóm tắt *</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <!-- Authors Multi-select -->
        <div class="col-span-1-5">
          <label class="select-label">Tác giả *</label>
          <ng-select
            [items]="data.authors$ | async"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="authorName"
            bindValue="id"
            placeholder="Chọn tác giả..."
            formControlName="authorIds"
          >
          </ng-select>
        </div>

        <!-- Genres Multi-select -->
        <div class="col-span-1-5">
          <label class="select-label">Thể loại *</label>
          <ng-select
            [items]="data.genres$ | async"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="genreName"
            bindValue="id"
            placeholder="Chọn thể loại..."
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
              alt="Bìa sách"
              class="book-cover-preview"
            />
            <div *ngIf="!previewImageUrl" class="cover-placeholder">
              <mat-icon>image</mat-icon>
              <span>Chưa có ảnh bìa</span>
            </div>
          </div>
          <div class="image-upload-controls">
            <label class="upload-btn-label">Tải lên ảnh bìa sách (Cloudinary CDN):</label>
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
            <small class="upload-note">Ảnh sẽ được tự động crop và nén WebP/AVIF tối ưu trên Cloudinary.</small>
          </div>
        </div>

        <div mat-dialog-actions align="end" class="col-span-3 actions-bar">
          <button mat-button (click)="onCanceled()">Hủy</button>
          <button
            mat-raised-button
            color="primary"
            (click)="onSubmit()"
            [disabled]="bookForm.invalid"
            cdkFocusInitial
          >
            Lưu sách
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

  isbnLookupControl = new FormControl<string>("");

  bookForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    title: new FormControl<string>("", Validators.required),
    description: new FormControl<string>("", Validators.required),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    publishedYear: new FormControl<number>(new Date().getFullYear(), Validators.required),
    isbn: new FormControl<string>(""),
    pageCount: new FormControl<number | null>(null),
    language: new FormControl<string>("Tiếng Việt"),
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
    this.lookupMessage.set("Đang tìm thông tin trên Google Books...");
    this.lookupSuccess.set(false);

    this.bookService.lookupIsbn(isbn).subscribe({
      next: (res) => {
        this.isLookingUp.set(false);
        if (res && res.found) {
          this.lookupSuccess.set(true);
          this.lookupMessage.set(`Đã tìm thấy sách: "${res.title}"! Dữ liệu đã được tự động điền.`);

          this.bookForm.patchValue({
            isbn: res.isbn || isbn,
            title: res.title || this.bookForm.get("title")?.value,
            description: res.description || this.bookForm.get("description")?.value,
            publishedYear: res.publishedYear || this.bookForm.get("publishedYear")?.value,
            pageCount: res.pageCount || null,
            language: res.language || this.bookForm.get("language")?.value,
            publisher: res.publisher || this.bookForm.get("publisher")?.value,
          });

          if (res.imageUrl) {
            this.previewImageUrl = res.imageUrl;
            this.bookForm.get("imageUrl")?.setValue(res.imageUrl);
          }
        } else {
          this.lookupSuccess.set(false);
          this.lookupMessage.set("Không tìm thấy thông tin trên Google Books cho mã ISBN này. Bạn hãy nhập thủ công.");
        }
      },
      error: () => {
        this.isLookingUp.set(false);
        this.lookupSuccess.set(false);
        this.lookupMessage.set("Lỗi kết nối khi tra cứu ISBN.");
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
        language: b.language || "Tiếng Việt",
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
        if (b.imageUrl.startsWith("http://") || b.imageUrl.startsWith("https://")) {
          this.previewImageUrl = b.imageUrl;
        } else {
          this.previewImageUrl = this.imageBaseUrl + b.imageUrl;
        }
      }
    }
  }
}
