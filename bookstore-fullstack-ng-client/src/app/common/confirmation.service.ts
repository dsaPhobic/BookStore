import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { map, Observable } from "rxjs";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from "./confirmation-dialog.component";

@Injectable({ providedIn: "root" })
export class ConfirmationService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data,
        width: "420px",
        maxWidth: "calc(100vw - 32px)",
        autoFocus: "dialog",
      })
      .afterClosed()
      .pipe(map((confirmed) => confirmed === true));
  }
}
