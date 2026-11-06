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
    <mat-card class="example-card" *ngFor="let book of books">
      <img
        [routerLink]="['/books', book.id]"
        mat-card-image
        class="book-image"
        [src]="baseUrl + '/resources/' + book.imageUrl"
        alt="book image"
        style="cursor:pointer"
      />
      <mat-card-content
        [routerLink]="['/books', book.id]"
        style="cursor:pointer"
      >
        <div style="font-weight: bold;margin:2px 0px">{{ book.title }}</div>

        <div class="">By {{ book.authorNames }}</div>

        <div class="">{{ book.genreNames }}</div>
        <div class="">₹{{ book.price }}</div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="accent" (click)="addToCart.emit(book)">
          <mat-icon>shopping_cart</mat-icon>
          Add To Cart
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .example-card {
        max-width: 170px;
      }

      .book-image {
        /* background-image: url("https://material.angular.io/assets/img/examples/shiba1.jpg"); */
        background-size: cover;
      }

      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 40px;
        padding: 0px 97px;
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
