import { HttpErrorResponse } from "@angular/common/http";
import { UserOrderModel } from "../../data/user-order.model";
import { createReducer, on } from "@ngrx/store";
import { userOrderActions } from "./user-order.actions";

export const userOrderFeaturKey = "userOrder";
export interface UserOrderState {
  orders: ReadonlyArray<UserOrderModel>;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  searchTerm: string | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: UserOrderState = {
  orders: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
  searchTerm: "",
  startDate: "",
  endDate: "",
  sortBy: "",
  loading: false,
  error: null,
};

export const userOrderReducers = createReducer(
  initialState,
  on(userOrderActions.getUserOrder, (state) => ({
    ...state,
    loading: true,
  })),
  on(userOrderActions.getUserOrderSuccess, (state, { orders }) => ({
    ...state,
    loading: false,
    orders,
  })),
  on(userOrderActions.getUserOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(userOrderActions.setCurrentPage, (state, { page }) => {
    //console.log("page number from dispatch: " + page);
    return {
      ...state,
      pageNumber: page,
    };
  }),
  on(userOrderActions.setPageSize, (state, { pageSize }) => {
    //console.log("page size(limit) from dispatch: " + pageSize);

    return {
      ...state,
      pageSize,
    };
  }),
  on(userOrderActions.setTotalCount, (state, { totalCount }) => {
    //console.log("page size(limit) from dispatch: " + pageSize); //working and able to log value

    return {
      ...state,
      totalCount,
    };
  }),
  on(userOrderActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(userOrderActions.setStartDate, (state, { startDate }) => ({
    ...state,
    startDate,
  })),
  on(userOrderActions.setEndDate, (state, { endDate }) => ({
    ...state,
    endDate,
  })),
  on(userOrderActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
  }))
);
