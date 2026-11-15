import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaymentMethodModel } from "./payment-method.model";
import { environment } from "../../../environments/environment.development";
import { OrderCreateModel } from "./order-create.model";
import { OrderItem, UserOrderModel } from "./user-order.model";
import { PagedList } from "../../common/paged-list.model";
import { CouponApplyResultModel } from "./coupon-apply-result.model";

@Injectable({ providedIn: "root" })
export class OrderService {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl + "/api/orders";

  getPaymentMethods = (): Observable<Array<PaymentMethodModel>> =>
    this.http.get<Array<PaymentMethodModel>>(this.baseUrl + "/payment-methods");

  createOrder = (data: OrderCreateModel) =>
    this.http.post<any>(this.baseUrl, data);

  applyCoupon = (code: string): Observable<CouponApplyResultModel> =>
    this.http.post<CouponApplyResultModel>(
      environment.baseUrl + "/api/coupons/apply",
      { code }
    );

  getUserOrders({
    pageSize = 10,
    pageNumber = 1,
    searchTerm = "",
    sortBy = "",
    startDate = "",
    endDate = "",
  }): Observable<PagedList<UserOrderModel>> {
    let params = new HttpParams();
    params = params.set("pageSize", pageSize.toString());
    params = params.set("pageNumber", pageNumber.toString());
    params = params.set("searchTerm", searchTerm);
    params = params.set("sortBy", sortBy);
    if (startDate && endDate) {
      params = params.set("startDate", startDate);
      params = params.set("endDate", endDate);
    }
    return this.http.get<PagedList<UserOrderModel>>(
      this.baseUrl + "/my-orders",
      { params }
    );
  }

  getCustomerOrders({
    pageSize = 10,
    pageNumber = 1,
    searchTerm = "",
    sortBy = "",
    startDate = "",
    endDate = "",
  }): Observable<PagedList<UserOrderModel>> {
    let params = new HttpParams();
    params = params.set("pageSize", pageSize.toString());
    params = params.set("pageNumber", pageNumber.toString());
    params = params.set("searchTerm", searchTerm);
    params = params.set("sortBy", sortBy);
    if (startDate && endDate) {
      params = params.set("startDate", startDate);
      params = params.set("endDate", endDate);
    }
    return this.http.get<PagedList<UserOrderModel>>(
      this.baseUrl + "/customer-orders",
      { params }
    );
  }

  getOrderItemsByOrderId(orderId: number): Observable<Array<OrderItem>> {
    return this.http.get<Array<OrderItem>>(
      this.baseUrl + "/orderitems/" + orderId
    );
  }

  getOrder(orderId: number): Observable<UserOrderModel> {
    return this.http.get<UserOrderModel>(`${this.baseUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: number, orderStatus: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${orderId}/status`, {
      orderStatus,
    });
  }
}
