import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userOrderFeaturKey, UserOrderState } from "./user-order.reducers";

export const selectUserOrderState =
  createFeatureSelector<UserOrderState>(userOrderFeaturKey);

export const selectUserOrders = createSelector(
  selectUserOrderState,
  (state) => state.orders
);

export const selectUserOrderLoading = createSelector(
  selectUserOrderState,
  (state) => state.loading
);

export const selectUserOrderError = createSelector(
  selectUserOrderState,
  (state) => state.error
);

export const selectUserOrderTotalCount = createSelector(
  selectUserOrderState,
  (state) => state.totalCount
);

export const selectUserOrderCurrentPage = createSelector(
  selectUserOrderState,
  (state) => state.pageNumber
);

export const selectUserOrderPageSize = createSelector(
  selectUserOrderState,
  (state) => state.pageSize
);

export const selectUserOrderTotalPages = createSelector(
  selectUserOrderState,
  (state) => state.totalPages
);

export const selectUserOrderHasNext = createSelector(
  selectUserOrderState,
  (state) => state.hasNext
);

export const selectUserOrderHasPrevious = createSelector(
  selectUserOrderState,
  (state) => state.hasPrevious
);
