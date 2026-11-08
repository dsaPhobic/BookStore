import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserOrderModel } from "../../data/user-order.model";
import { HttpErrorResponse } from "@angular/common/http";

export const userOrderActions = createActionGroup({
  source: "UserOrder",
  events: {
    getUserOrder: emptyProps(),
    getUserOrderSuccess: props<{ orders: ReadonlyArray<UserOrderModel> }>(),
    getUserOrderFailure: props<{ error: HttpErrorResponse }>(),
    "set current page": props<{ page: number }>(),
    "set page size": props<{ pageSize: number }>(),
    "set total count": props<{ totalCount: number }>(),
    "set search term": props<{ searchTerm: string | null }>(),
    "set start date": props<{ startDate: string | null }>(),
    "set end date": props<{ endDate: string | null }>(),
    "set sort by": props<{ sortBy: string }>(),
  },
});
