import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { UserOrderModel } from "../../order/data/user-order.model";

export const customerOrderActions = createActionGroup({
  source: "CustomerOrder",
  events: {
    getCustomerOrder: emptyProps(),
    getCustomerOrderSuccess: props<{ orders: ReadonlyArray<UserOrderModel> }>(),
    getCustomerOrderFailure: props<{ error: HttpErrorResponse }>(),
    "set current page": props<{ page: number }>(),
    "set page size": props<{ pageSize: number }>(),
    "set total count": props<{ totalCount: number }>(),
    "set search term": props<{ searchTerm: string | null }>(),
    "set start date": props<{ startDate: string | null }>(),
    "set end date": props<{ endDate: string | null }>(),
    "set sort by": props<{ sortBy: string }>(),
  },
});
