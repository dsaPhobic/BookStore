import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { CartItem } from "../data/cart-read.model";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "../../../environments/environment.development";
import { getImageUrl } from "../../utils/image.utils";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-cart-item",
  standalone: true,
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf,
  ],
  template: `
    <div class="cover-box">
      <img
        *ngIf="cartItem.book.imageUrl; else fallbackIcon"
        [src]="getImageUrl(cartItem.book.imageUrl)"
        [alt]="cartItem.book.title"
      />
      <ng-template #fallbackIcon>
        <mat-icon>menu_book</mat-icon>
      </ng-template>
    </div>

    <div class="info-box">
      <h4>{{ cartItem.book.title }}</h4>
      <p class="sub">
        {{ cartItem.book.authorNames }} • {{ cartItem.book.publishedYear }}
      </p>
      <span class="chip" *ngIf="cartItem.book.genreNames">
        {{ cartItem.book.genreNames }}
      </span>
    </div>

    <div class="purchase-box">
      <div class="qty-box">
        <span class="qty-label">Qty</span>
        <mat-select
          aria-label="Quantity"
          [formControl]="quantity"
          class="quantity-select"
        >
          <mat-option
            *ngFor="let qty of [1, 2, 3, 4, 5]; trackBy: trackByFn"
            [value]="qty"
            >{{ qty }}</mat-option
          >
        </mat-select>
      </div>
      <div class="price-box">
        <span class="unit"
          >\${{ cartItem.book.price.toFixed(2) }} each</span
        >
        <strong class="line-total">
          \${{ (cartItem.book.price * cartItem.quantity).toFixed(2) }}
        </strong>
      </div>
    </div>

    <button
      mat-icon-button
      color="warn"
      class="delete-button"
      (click)="deleteItem.emit(cartItem.id)"
      title="Remove item"
    >
      <mat-icon>delete_outline</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr) minmax(245px, 265px) 40px;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: var(--bs-surface);
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius);
        box-shadow: var(--bs-shadow-sm);
      }

      .cover-box {
        width: 72px;
        height: 96px;
        border-radius: 8px;
        overflow: hidden;
        background: var(--bs-surface-2);
        border: 1px solid var(--bs-border);
        display: grid;
        place-items: center;
      }

      .cover-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .info-box h4 {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: 600;
        color: var(--bs-ink-dark);
      }

      .info-box .sub {
        margin: 0 0 8px;
        font-size: 13px;
        color: var(--bs-muted);
      }

      .purchase-box {
        min-height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 8px 14px;
        border: 1px solid var(--bs-border);
        border-radius: 12px;
        background: var(--bs-surface);
      }

      .qty-box {
        min-width: 48px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .qty-label {
        color: var(--bs-muted);
        font-size: 12px;
        line-height: 1.2;
      }

      .quantity-select {
        width: 52px;
        color: var(--bs-text);
        font-size: 16px;
      }

      .price-box {
        display: flex;
        flex-direction: column;
        text-align: right;
        line-height: 1.25;
      }

      .price-box .unit {
        font-size: 14px;
        color: var(--bs-muted);
      }

      .price-box .line-total {
        font-family: var(--bs-font-mono);
        font-size: 20px;
        font-weight: 700;
        color: var(--bs-ink-dark);
      }

      @media (max-width: 640px) {
        :host {
          grid-template-columns: 60px minmax(0, 1fr) 40px;
          gap: 12px;
          padding: 14px;
        }

        .cover-box {
          width: 60px;
          height: 80px;
        }

        .purchase-box {
          grid-column: 2 / 4;
          width: 100%;
          min-height: 64px;
          padding: 8px 12px;
        }

        .delete-button {
          grid-column: 3;
          grid-row: 1;
          align-self: start;
        }

        .price-box .unit {
          font-size: 12px;
        }

        .price-box .line-total {
          font-size: 18px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent implements OnInit {
  imageBaseUrl = environment.baseUrl + "/resources/";
  @Input({ required: true }) cartItem!: CartItem;

  getImageUrl(url?: string | null): string {
    return getImageUrl(url);
  }
  @Output() deleteItem = new EventEmitter<number>();
  @Output() selectQuantity = new EventEmitter<{
    cartItem: CartItem;
    newQuantity: number;
  }>();

  quantity = new FormControl<number>(1);

  trackByFn(index: number, qty: number) {
    return qty;
  }

  constructor() {
    this.quantity.valueChanges
      .pipe(
        tap((qty) => {
          if (qty)
            this.selectQuantity.emit({
              cartItem: this.cartItem,
              newQuantity: qty,
            });
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.quantity.setValue(this.cartItem.quantity);
  }
}
