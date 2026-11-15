import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CartItem } from "../data/cart-read.model";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { getImageUrl } from "../../utils/image.utils";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-cart-item",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
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
      <!-- Stock badge -->
      <p class="stock-badge out-of-stock" *ngIf="cartItem.book.stockQuantity === 0">
        <mat-icon class="badge-icon">inventory_2</mat-icon> Hết hàng
      </p>
      <p class="stock-badge low-stock" *ngIf="cartItem.book.stockQuantity > 0 && cartItem.book.stockQuantity <= 5">
        <mat-icon class="badge-icon">warning</mat-icon>
        Chỉ còn {{ cartItem.book.stockQuantity }} cuốn!
      </p>
      <!-- Warning when quantity exceeds stock -->
      <p class="stock-warning" *ngIf="localStockWarning">
        {{ localStockWarning }}
      </p>
      <span class="chip" *ngIf="cartItem.book.genreNames">
        {{ cartItem.book.genreNames }}
      </span>
    </div>

    <div class="purchase-box">
      <div class="qty-box">
        <label class="qty-label" [for]="'quantity-' + cartItem.id">Qty</label>
        <div class="stepper">
          <button
            mat-icon-button
            class="step-btn"
            [disabled]="quantity.value === null || quantity.value <= 1"
            (click)="decrement()"
            type="button"
            aria-label="Decrease quantity"
          >
            <mat-icon>remove</mat-icon>
          </button>
          <input
            [id]="'quantity-' + cartItem.id"
            type="number"
            min="1"
            [max]="cartItem.book.stockQuantity"
            step="1"
            inputmode="numeric"
            [attr.aria-label]="'Quantity for ' + cartItem.book.title"
            [formControl]="quantity"
            class="quantity-input"
            (change)="onQuantityCommit()"
            (blur)="onQuantityCommit()"
          />
          <button
            mat-icon-button
            class="step-btn"
            [disabled]="quantity.value === null || quantity.value >= cartItem.book.stockQuantity"
            (click)="increment()"
            type="button"
            aria-label="Increase quantity"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
      <div class="price-box">
        <span class="unit">\${{ cartItem.book.price.toFixed(2) }} each</span>
        <strong class="line-total">\${{ lineTotal }}</strong>
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
        grid-template-columns: 72px minmax(0, 1fr) minmax(265px, 285px) 40px;
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

      .stock-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 4px;
        padding: 2px 8px;
        width: fit-content;
      }

      .stock-badge.out-of-stock {
        background: #fee2e2;
        color: #991b1b;
      }

      .stock-badge.low-stock {
        background: #ffedd5;
        color: #9a3412;
      }

      .badge-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
      }

      .stock-warning {
        margin: 0 0 6px;
        color: #b91c1c;
        font-size: 12px;
        font-style: italic;
      }

      .info-box .sub {
        margin: 0 0 6px;
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
        margin-bottom: 2px;
      }

      .stepper {
        display: flex;
        align-items: center;
        gap: 0;
        border: 1px solid var(--bs-border);
        border-radius: 8px;
        overflow: hidden;
      }

      .step-btn {
        width: 32px !important;
        height: 32px !important;
        border-radius: 0 !important;
        background: var(--bs-surface-2) !important;
        flex-shrink: 0;
      }

      .step-btn .mat-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }

      .step-btn:disabled {
        opacity: 0.4 !important;
      }

      .quantity-input {
        width: 44px;
        height: 32px;
        padding: 0 4px;
        border: none;
        border-left: 1px solid var(--bs-border);
        border-right: 1px solid var(--bs-border);
        background: var(--bs-surface);
        color: var(--bs-text);
        font-size: 15px;
        font-weight: 600;
        text-align: center;
        -moz-appearance: textfield;
      }

      .quantity-input::-webkit-inner-spin-button,
      .quantity-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      .quantity-input:focus-visible {
        outline: 2px solid var(--bs-ink);
        outline-offset: 1px;
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
export class CartItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) cartItem!: CartItem;

  getImageUrl(url?: string | null): string {
    return getImageUrl(url);
  }
  @Output() deleteItem = new EventEmitter<number>();
  @Output() selectQuantity = new EventEmitter<{
    cartItem: CartItem;
    newQuantity: number;
  }>();

  quantity = new FormControl<number | null>(1);
  localStockWarning: string | null = null;

  get lineTotal(): string {
    const enteredQuantity = this.quantity.value;
    const quantity =
      enteredQuantity !== null &&
      Number.isSafeInteger(enteredQuantity) &&
      enteredQuantity > 0
        ? enteredQuantity
        : this.cartItem.quantity;
    return (this.cartItem.book.price * quantity).toFixed(2);
  }

  increment(): void {
    const current = this.quantity.value ?? 1;
    const max = this.cartItem.book.stockQuantity;
    if (current < max) {
      this.quantity.setValue(current + 1, { emitEvent: false });
      this.localStockWarning = null;
      this.commitQuantity(current + 1);
    }
  }

  decrement(): void {
    const current = this.quantity.value ?? 1;
    if (current > 1) {
      this.quantity.setValue(current - 1, { emitEvent: false });
      this.localStockWarning = null;
      this.commitQuantity(current - 1);
    }
  }

  onQuantityCommit(): void {
    const newQuantity = this.quantity.value;
    if (
      newQuantity === null ||
      !Number.isSafeInteger(newQuantity) ||
      newQuantity < 1
    ) {
      this.quantity.setValue(this.cartItem.quantity, { emitEvent: false });
      this.localStockWarning = null;
      return;
    }

    const max = this.cartItem.book.stockQuantity;
    if (newQuantity > max) {
      // Clamp to max stock
      this.quantity.setValue(max, { emitEvent: false });
      this.localStockWarning = `Chỉ còn ${max} cuốn trong kho — đã điều chỉnh tự động.`;
      this.commitQuantity(max);
      return;
    }

    this.localStockWarning = null;
    this.commitQuantity(newQuantity);
  }

  private commitQuantity(newQuantity: number): void {
    if (newQuantity !== this.cartItem.quantity) {
      this.selectQuantity.emit({
        cartItem: this.cartItem,
        newQuantity,
      });
    }
  }

  ngOnInit(): void {
    this.quantity.setValue(this.cartItem.quantity, { emitEvent: false });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When cartItem changes (e.g. after update success/failure),
    // revert the quantity control to match the actual state in store.
    if (changes['cartItem'] && !changes['cartItem'].firstChange) {
      const actual = this.cartItem.quantity;
      if (this.quantity.value !== actual) {
        this.quantity.setValue(actual, { emitEvent: false });
      }
      this.localStockWarning = null;
    }
  }
}
