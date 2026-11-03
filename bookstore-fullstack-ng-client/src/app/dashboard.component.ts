import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { selectUserInfo } from "./account/state/account.selectors";
import { Store } from "@ngrx/store";
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    <ng-container *ngIf="userInfo$ | async as userInfo">
      <h1>Welcome {{ userInfo.username }}</h1>
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  store = inject(Store);
  userInfo$ = this.store.select(selectUserInfo);
}
