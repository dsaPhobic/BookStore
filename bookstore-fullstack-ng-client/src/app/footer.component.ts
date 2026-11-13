import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  template: `
    <footer class="footer"></footer>
  `,
  styles: [
    `
      :host {
        margin-top: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
