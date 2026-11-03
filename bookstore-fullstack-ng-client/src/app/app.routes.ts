import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { roleGuard } from "./helpers/role.guard";
import { routeGuard } from "./helpers/route.guard";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "manage-books",
    canActivate: [roleGuard],
    data: { roles: ["Admin"] },
    loadComponent: () =>
      import("./book/book.component").then((m) => m.BookComponent),
  },
  {
    path: "genres",
    canActivate: [roleGuard],
    data: { roles: ["Admin"] },
    loadComponent: () =>
      import("./genre/genre.component").then((c) => c.GenreComponent),
  },
  {
    path: "authors",
    canActivate: [roleGuard],
    data: { roles: ["Admin"] },
    loadComponent: () =>
      import("./authors/author.component").then((c) => c.AuthorComponent),
  },
  {
    path: "customer-order",
    canActivate: [roleGuard],
    data: { roles: ["Admin"] },
    loadComponent: () =>
      import("./customer-orders/customer-orders.component").then(
        (c) => c.CustomerOrdersComponent
      ),
  },
  {
    path: "customer-orders/detail/:id",
    canActivate: [roleGuard],
    data: { roles: ["Admin"] },
    loadComponent: () =>
      import("./customer-orders/order-detail.component").then(
        (c) => c.OrderDetailComponent
      ),
  },

  {
    path: "signup",
    loadComponent: () =>
      import("./account/registration.component").then(
        (c) => c.RegistrationComponent
      ),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./account/login.component").then((c) => c.LoginComponent),
  },
  {
    path: "dashboard",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./dashboard.component").then((c) => c.DashboardComponent),
  },
  {
    path: "cart",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./cart/cart.component").then((c) => c.CartComponent),
  },
  {
    path: "create-order",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./order/create-order.component").then(
        (c) => c.CreateOrderComponent
      ),
  },
  {
    path: "order-success",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./order/order-success.component").then(
        (o) => o.OrderSuccessComponent
      ),
  },
  {
    path: "order-failure",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./order/order-failure.component").then(
        (o) => o.OrderFailureComponent
      ),
  },
  {
    path: "my-orders",
    canActivate: [routeGuard],
    loadComponent: () =>
      import("./order/user-order.component").then((o) => o.UserOrderComponent),
  },
  {
    path: "books",
    loadChildren: () =>
      import("./book-public/book-public.routes").then(
        (m) => m.BOOK_PUBLIC_ROUTES
      ),
  },
  {
    path: "unauthorized",
    loadComponent: () =>
      import("./unauthorized.component").then((c) => c.UnauthorizedComponent),
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "**",
    loadComponent: () =>
      import("./not-found.component").then((c) => c.NotFoundComponent),
  },
];
