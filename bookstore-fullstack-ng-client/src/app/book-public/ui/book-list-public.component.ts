import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { environment } from "../../../environments/environment.development";
import { BookReadModel } from "../../book/Data/book-read.model";

@Component({
  selector: "app-book-list-public",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <article class="book-card" *ngFor="let book of books">
      <a class="cover-wrap" [routerLink]="['/books', book.id]">
        <img
          *ngIf="book.imageUrl; else placeholderCover"
          class="book-cover"
          [src]="baseUrl + '/resources/' + book.imageUrl"
          [alt]="book.title"
          loading="lazy"
        />
        <ng-template #placeholderCover>
          <div class="cover-placeholder">
            <mat-icon>menu_book</mat-icon>
            <span>{{ book.title }}</span>
          </div>
        </ng-template>
        <span class="year-badge" *ngIf="book.publishedYear">
          {{ book.publishedYear }}
        </span>
      </a>

      <div class="card-body">
        <div class="genre-row" *ngIf="book.genres?.length">
          <span class="chip" *ngFor="let g of book.genres">
            {{ g.genreName }}
          </span>
        </div>

        <a class="book-title" [routerLink]="['/books', book.id]">
          {{ book.title }}
        </a>

        <div class="book-author">
          by {{ book.authorNames || "Unknown Author" }}
        </div>

        <div class="card-footer">
          <div class="book-price">\${{ book.price }}</div>
          <button
            mat-flat-button
            color="accent"
            class="add-btn"
            (click)="addToCart.emit(book)"
          >
            <mat-icon>add_shopping_cart</mat-icon>
            Add
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 24px;
        width: 100%;
      }

      .book-card {
        background: var(--bs-surface);
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .book-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--bs-shadow);
      }

      .cover-wrap {
        position: relative;
        aspect-ratio: 3 / 4;
        background: var(--bs-surface-2);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        text-decoration: none;
      }

      .book-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .book-card:hover .book-cover {
        transform: scale(1.04);
      }

      .cover-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 20px;
        text-align: center;
        color: var(--bs-muted);
      }

      .cover-placeholder .mat-icon {
        font-size: 44px;
        width: 44px;
        height: 44px;
        color: var(--bs-ink);
      }

      .year-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(26, 35, 77, 0.82);
        backdrop-filter: blur(6px);
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 9px;
        border-radius: 999px;
      }

      .card-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 6px;
      }

      .genre-row {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }

      .book-title {
        font-family: var(--bs-font-heading);
        font-size: 17px;
        font-weight: 700;
        color: var(--bs-ink-dark);
        text-decoration: none;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.3;
      }

      .book-title:hover {
        color: var(--bs-accent);
      }

      .book-author {
        font-size: 13px;
        color: var(--bs-muted);
        margin-bottom: 8px;
      }

      .card-footer {
        margin-top: auto;
        padding-top: 10px;
        border-top: 1px solid var(--bs-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .book-price {
        font-size: 19px;
        font-weight: 700;
        color: var(--bs-ink-dark);
      }

      .add-btn {
        height: 36px !important;
        padding: 0 14px !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListPublicComponent {
  baseUrl = environment.baseUrl;
  @Input() books!: readonly BookReadModel[];
  @Output() addToCart = new EventEmitter<BookReadModel>();
}
