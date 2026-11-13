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
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-cart-item",
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
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
        [src]="imageBaseUrl + cartItem.book.imageUrl"
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

    <div class="qty-box">
      <mat-form-field appearance="outline" [subscriptSizing]="'dynamic'">
        <mat-label>Qty</mat-label>
        <mat-select [formControl]="quantity">
          <mat-option
            *ngFor="let qty of [1, 2, 3, 4, 5]; trackBy: trackByFn"
            [value]="qty"
            >{{ qty }}</mat-option
          >
        </mat-select>
      </mat-form-field>
    </div>

    <div class="price-box">
      <span class="unit">\${{ cartItem.book.price }} each</span>
      <strong class="line-total">
        \${{ (cartItem.book.price * cartItem.quantity).toFixed(2) }}
      </strong>
    </div>

    <button
      mat-icon-button
      color="warn"
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
        grid-template-columns: 72px 1fr 110px 110px 40px;
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

      .price-box {
        display: flex;
        flex-direction: column;
        text-align: right;
      }

      .price-box .unit {
        font-size: 12px;
        color: var(--bs-muted);
      }

      .price-box .line-total {
        font-size: 17px;
        color: var(--bs-ink-dark);
      }

      @media (max-width: 640px) {
        :host {
          grid-template-columns: 60px 1fr auto;
        }
        .price-box {
          text-align: left;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent implements OnInit {
  imageBaseUrl = environment.baseUrl + "/resources/";
  @Input({ required: true }) cartItem!: CartItem;
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
