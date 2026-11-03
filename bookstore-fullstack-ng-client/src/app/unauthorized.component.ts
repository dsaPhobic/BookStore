import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-unauthorized",
  standalone: true,
  imports: [],
  template: ` <p>403 unauthorized</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent {}
