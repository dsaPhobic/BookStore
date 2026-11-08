import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  customerOrderFeaturKey,
  CustomerOrderState,
} from "./customer-order.reducer";

export const selectCustomerOrderState =
  createFeatureSelector<CustomerOrderState>(customerOrderFeaturKey);

export const selectCustomerOrders = createSelector(
  selectCustomerOrderState,
  (state) => state.orders
);

export const selectCustomerOrderLoading = createSelector(
  selectCustomerOrderState,
  (state) => state.loading
);

export const selectCustomerOrderError = createSelector(
  selectCustomerOrderState,
  (state) => state.error
);

export const selectCustomerOrderTotalCount = createSelector(
  selectCustomerOrderState,
  (state) => state.totalCount
);

export const selectCustomerOrderCurrentPage = createSelector(
  selectCustomerOrderState,
  (state) => state.pageNumber
);

export const selectCustomerOrderPageSize = createSelector(
  selectCustomerOrderState,
  (state) => state.pageSize
);

export const selectCustomerOrderTotalPages = createSelector(
  selectCustomerOrderState,
  (state) => state.totalPages
);

export const selectCustomerOrderHasNext = createSelector(
  selectCustomerOrderState,
  (state) => state.hasNext
);

export const selectCustomerOrderHasPrevious = createSelector(
  selectCustomerOrderState,
  (state) => state.hasPrevious
);
