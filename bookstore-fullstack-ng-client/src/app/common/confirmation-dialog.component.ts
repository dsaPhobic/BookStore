import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
}

@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <div class="confirmation-icon" aria-hidden="true">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <p mat-dialog-content>{{ data.message }}</p>
      <div mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]="false">
          {{ data.cancelText ?? "Cancel" }}
        </button>
        <button mat-flat-button color="warn" [mat-dialog-close]="true">
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirmation-dialog {
        padding: 8px 4px 0;
      }

      .confirmation-icon {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin: 0 0 14px;
        border-radius: 50%;
        background: #fdecec;
        color: #c62828;
      }

      .confirmation-icon mat-icon {
        width: 24px;
        height: 24px;
        font-size: 24px;
      }

      h2 {
        margin: 0;
      }

      p {
        color: var(--bs-muted);
        line-height: 1.55;
      }

      [mat-dialog-actions] {
        gap: 8px;
        padding: 12px 0 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmationDialogData
  ) {}
}
