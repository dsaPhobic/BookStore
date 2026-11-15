import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { DashboardSummary } from "./dashboard-summary.model";

@Injectable({ providedIn: "root" })
export class AnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "/api/analytics";

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.baseUrl}/dashboard-summary`
    );
  }
}
