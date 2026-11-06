import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { PageSelectorModel } from "../../common/page-selector.model";

@Component({
  selector: "app-book-paginator",
  standalone: true,
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalRecords"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 50, 100]"
      aria-label="Select page"
      (page)="onPageSelect($event)"
    >
    </mat-paginator>
  `,
  styles: [
    `
      mat-paginator {
        margin-top: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPaginatorComponent {
  @Output() pageSelect = new EventEmitter<PageSelectorModel>();
  @Input({ required: true }) totalRecords!: number;

  onPageSelect(e: PageEvent) {
    const page = e.pageIndex + 1;
    const limit = e.pageSize;
    this.pageSelect.emit({ page, limit });
  }
}
