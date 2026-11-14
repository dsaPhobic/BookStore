import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { CouponCreateModel, CouponModel } from "./coupon.model";

@Injectable({ providedIn: "root" })
export class CouponService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/api/coupons`;

  getCoupons(): Observable<CouponModel[]> {
    return this.http.get<CouponModel[]>(this.baseUrl);
  }

  createCoupon(coupon: CouponCreateModel): Observable<CouponModel> {
    return this.http.post<CouponModel>(this.baseUrl, coupon);
  }
}
