import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import { UserOrderModel } from "../../order/data/user-order.model";
import { customerOrderActions } from "./customer-order.actions";

export const customerOrderFeaturKey = "customerOrder";
export interface CustomerOrderState {
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

export const initialState: CustomerOrderState = {
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

export const customerOrderReducers = createReducer(
  initialState,
  on(customerOrderActions.getCustomerOrder, (state) => ({
    ...state,
    loading: true,
  })),
  on(customerOrderActions.getCustomerOrderSuccess, (state, { orders }) => ({
    ...state,
    loading: false,
    orders,
  })),
  on(customerOrderActions.getCustomerOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(customerOrderActions.setCurrentPage, (state, { page }) => {
    //console.log("page number from dispatch: " + page);
    return {
      ...state,
      pageNumber: page,
    };
  }),
  on(customerOrderActions.setPageSize, (state, { pageSize }) => {
    //console.log("page size(limit) from dispatch: " + pageSize);

    return {
      ...state,
      pageSize,
    };
  }),
  on(customerOrderActions.setTotalCount, (state, { totalCount }) => {
    //console.log("page size(limit) from dispatch: " + pageSize); //working and able to log value

    return {
      ...state,
      totalCount,
    };
  }),
  on(customerOrderActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(customerOrderActions.setStartDate, (state, { startDate }) => ({
    ...state,
    startDate,
  })),
  on(customerOrderActions.setEndDate, (state, { endDate }) => ({
    ...state,
    endDate,
  })),
  on(customerOrderActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
  }))
);
