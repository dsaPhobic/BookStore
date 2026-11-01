import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { RegistrationFormComponet } from "./ui/registration-form.component";
import { RegistrationModel } from "./data/registration.model";
import { BehaviorSubject, startWith, Subject, takeUntil } from "rxjs";
import { AccountService } from "./data/account.service";
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  selector: "app-registration",
  standalone: true,
  imports: [RegistrationFormComponet, NgIf, AsyncPipe],
  template: `
    <div class="container">
      <h2>Signup</h2>

      <ng-container *ngIf="message$ | async as message">
        <div class="message-container">
          {{ message }}
        </div>
      </ng-container>

      <app-registration-form (submitData)="onFormSubmit($event)" />
    </div>
  `,
  styles: [
    `
      .message-container {
        margin-bottom: 10px;
      }
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        width: 50%;
        height: 60%;
        margin: 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnDestroy, OnInit {
  message$ = new BehaviorSubject<string>("");
  destroyed$ = new Subject<boolean>();
  accoutService = inject(AccountService);

  onFormSubmit(registrationData: RegistrationModel) {
    this.message$.next("wait...");

    this.accoutService
      .registration(registrationData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.message$.next("Saved successfully");
        },
        error: (error) => {
          console.log(error);
          this.message$.next("Error on saving data");
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  ngOnInit(): void {}
}
