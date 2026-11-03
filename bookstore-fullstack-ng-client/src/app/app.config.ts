import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideStore } from "@ngrx/store";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideEffects } from "@ngrx/effects";
import { genreFeatureKey, genreReducers } from "./genre/state/genre.reducers";
import { GenreEffects } from "./genre/state/genre.effects";
import {
  accountFeatureKey,
  accountReducers,
} from "./account/state/account.reducers";
import { AccountEffects } from "./account/state/account.effects";
import { authInterceptor } from "./helpers/auth.interceptor";
import {
  authorFeaturKey,
  authorReducers,
} from "./authors/state/author.reducers";
import { AuthorEffects } from "./authors/state/author.effects";
import { bookFeatureKey, bookReducer } from "./book/state/book.reducers";
import { BookEffects } from "./book/state/book.effects";
import { cartFeatureKey, cartReducers } from "./cart/state/cart.reducers";
import { CartEffects } from "./cart/state/cart.effects";
import { UserOrderEffects } from "./order/state/user-order/user-order.effects";
import {
  userOrderFeaturKey,
  userOrderReducers,
} from "./order/state/user-order/user-order.reducers";
import { CustomerOrderEffects } from "./customer-orders/state/customer-order.effects";
import {
  customerOrderFeaturKey,
  customerOrderReducers,
} from "./customer-orders/state/customer-order.reducer";

const reducers = {
  [genreFeatureKey]: genreReducers,
  [accountFeatureKey]: accountReducers,
  [authorFeaturKey]: authorReducers,
  [bookFeatureKey]: bookReducer,
  [cartFeatureKey]: cartReducers,
  [userOrderFeaturKey]: userOrderReducers,
  [customerOrderFeaturKey]: customerOrderReducers,
};

const effects = [
  GenreEffects,
  AccountEffects,
  AuthorEffects,
  BookEffects,
  CartEffects,
  UserOrderEffects,
  CustomerOrderEffects,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(reducers),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEffects(effects),
  ],
};
