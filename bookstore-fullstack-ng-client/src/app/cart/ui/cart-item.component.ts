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
import { NgFor } from "@angular/common";

@Component({
  selector: "app-cart-item",
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    NgFor,
  ],
  template: `
    <div class="item">
      <img [src]="imageBaseUrl + cartItem.book.imageUrl" />
    </div>
    <div class="item">{{ cartItem.book.title }}</div>
    <div class="item">{{ cartItem.book.authorNames }}</div>
    <div class="item">{{ cartItem.book.genreNames }}</div>
    <div class="item">{{ cartItem.book.publishedYear }}</div>
    <div class="item">₹{{ cartItem.book.price }}</div>
    <div class="item">
      <mat-form-field [subscriptSizing]="'dynamic'">
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
    <div class="item">
      <button mat-icon-button (click)="deleteItem.emit(cartItem.id)">
        <mat-icon color="accent">delete</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px 10px;
        font-size: 18px;
        background-color: rgb(249, 249, 249);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow */
        border: 1px solid rgb(78, 78, 78);
        border-radius: 10px;
        margin-bottom: 5px;
      }

      img {
        max-width: 80px;
        max-height: 80px;
        height: auto;
        width: auto;
        object-fit: contain;
      }

      mat-form-field {
        width: 100px;
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
