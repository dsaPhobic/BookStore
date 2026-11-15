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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgIf } from "@angular/common";
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
    MatCheckboxModule,
    NgIf,
  ],
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>

    <div mat-dialog-content>
      <form [formGroup]="authorForm" class="author-form">
        <input type="hidden" formControlName="id" />
        <input type="hidden" formControlName="avatarUrl" />
        <input type="hidden" formControlName="avatarPublicId" />

        <!-- Avatar Upload & Preview -->
        <div class="avatar-section">
          <div class="avatar-preview-box">
            <img
              *ngIf="previewAvatarUrl || authorForm.get('avatarUrl')?.value"
              [src]="previewAvatarUrl || authorForm.get('avatarUrl')?.value"
              alt="Avatar preview"
              class="avatar-img"
            />
            <div *ngIf="!previewAvatarUrl && !authorForm.get('avatarUrl')?.value" class="avatar-placeholder">
              <span>No Avatar</span>
            </div>
          </div>
          <div class="avatar-upload-action">
            <label class="upload-label">Ảnh đại diện Tác giả (Cloudinary):</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)" />
            <small class="hint">Khuyến nghị ảnh vuông (tối đa 2MB)</small>
          </div>
        </div>

        <div class="form-row">
          <mat-form-field appearance="fill" class="flex-1">
            <mat-label>Tên tác giả / Bút danh *</mat-label>
            <input type="text" matInput formControlName="authorName" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="flex-1">
            <mat-label>Tên thật (nếu có)</mat-label>
            <input type="text" matInput formControlName="originalName" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="fill" class="flex-1">
            <mat-label>Quốc tịch</mat-label>
            <input type="text" matInput formControlName="nationality" placeholder="VD: Việt Nam, Nhật Bản..." />
          </mat-form-field>

          <mat-form-field appearance="fill" class="flex-1">
            <mat-label>Ngày sinh</mat-label>
            <input type="date" matInput formControlName="birthDate" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Tiểu sử & Thành tựu (Bio)</mat-label>
          <textarea matInput formControlName="bio" rows="3" placeholder="Tóm tắt sự nghiệp, tác phẩm tiêu biểu..."></textarea>
        </mat-form-field>

        <div class="checkbox-row">
          <mat-checkbox formControlName="isFeatured" color="primary">
            Đánh dấu là Tác giả nổi bật (Featured Author)
          </mat-checkbox>
        </div>

        <div mat-dialog-actions align="end" class="dialog-actions">
          <button mat-button (click)="onCanceled()">Đóng</button>
          <button
            mat-raised-button
            color="primary"
            (click)="onSubmit()"
            [disabled]="authorForm.invalid"
            cdkFocusInitial
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .author-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 480px;
      padding-top: 8px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .flex-1 {
      flex: 1;
    }
    .full-width {
      width: 100%;
    }
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .avatar-preview-box {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #3f51b5;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      flex-shrink: 0;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-placeholder {
      font-size: 11px;
      color: #666;
      text-align: center;
    }
    .avatar-upload-action {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .upload-label {
      font-weight: 500;
      font-size: 13px;
    }
    .hint {
      color: #888;
      font-size: 11px;
    }
    .checkbox-row {
      padding: 4px 0;
    }
    .dialog-actions {
      margin-top: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorDialogComponent {
  @Output() submit = new EventEmitter<Author>();

  selectedAvatarFile: File | null = null;
  previewAvatarUrl: string | null = null;

  authorForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    authorName: new FormControl<string>("", Validators.required),
    originalName: new FormControl<string>(""),
    avatarUrl: new FormControl<string>(""),
    avatarPublicId: new FormControl<string>(""),
    nationality: new FormControl<string>(""),
    birthDate: new FormControl<string>(""),
    bio: new FormControl<string>(""),
    isFeatured: new FormControl<boolean>(false),
  });

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedAvatarFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewAvatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.authorForm.valid) {
      const authorVal = this.authorForm.value;
      const author: Author = {
        ...authorVal,
        avatarFile: this.selectedAvatarFile,
      };
      this.submit.emit(author);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<AuthorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { author: Author | null; title: string }
  ) {
    if (data.author != null) {
      const a = data.author;
      let birthDateFormatted = "";
      if (a.birthDate) {
        const d = new Date(a.birthDate);
        birthDateFormatted = d.toISOString().split("T")[0];
      }
      this.authorForm.patchValue({
        id: a.id,
        authorName: a.authorName,
        originalName: a.originalName || "",
        avatarUrl: a.avatarUrl || "",
        avatarPublicId: a.avatarPublicId || "",
        nationality: a.nationality || "",
        birthDate: birthDateFormatted,
        bio: a.bio || "",
        isFeatured: a.isFeatured || false,
      });
      if (a.avatarUrl) {
        this.previewAvatarUrl = a.avatarUrl;
      }
    }
  }
}
