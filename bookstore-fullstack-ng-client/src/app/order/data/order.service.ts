import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaymentMethodModel } from "./payment-method.model";
import { environment } from "../../../environments/environment.development";
import { OrderCreateModel } from "./order-create.model";
import { OrderItem, UserOrderModel } from "./user-order.model";
import { PagedList } from "../../common/paged-list.model";

@Injectable({ providedIn: "root" })
export class OrderService {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl + "/api/orders";

  getPaymentMethods = (): Observable<Array<PaymentMethodModel>> =>
    this.http.get<Array<PaymentMethodModel>>(this.baseUrl + "/payment-methods");

  createOrder = (data: OrderCreateModel) =>
    this.http.post<any>(this.baseUrl, data);

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
      this.baseUrl + "/user-orders",
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
    return this.http.get<PagedList<UserOrderModel>>(this.baseUrl, { params });
  }

  getOrderItemsByOrderId(orderId: number): Observable<Array<OrderItem>> {
    return this.http.get<Array<OrderItem>>(
      this.baseUrl + "/orderitems/" + orderId
    );
  }
}
