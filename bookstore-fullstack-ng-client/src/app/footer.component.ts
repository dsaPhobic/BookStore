import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      Developed in Angular with ❤️ by
      <a href="https://twitter.com/@ravi_devrani" target="_blank"
        >Ravindra Devrani</a
      >
    </footer>
  `,
  styles: [
    `
      :host {
        font-size: 16px;
        text-align: center;
        padding: 20px 0px;
        margin-top: auto;
      }

      a {
        color: black;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
