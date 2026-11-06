import { Route } from "@angular/router";
import { BookPublicComponent } from "./book-public.component";
import { BookDetailComponent } from "./book-detail.component";

export const BOOK_PUBLIC_ROUTES: Route[] = [
  {
    path: "",
    component: BookPublicComponent,
  },
  {
    path: ":id",
    component: BookDetailComponent,
  },
];
