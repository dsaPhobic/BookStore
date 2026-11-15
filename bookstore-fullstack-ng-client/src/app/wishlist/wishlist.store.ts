import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { distinctUntilChanged, finalize } from "rxjs";
import { selectLoginState } from "../account/state/account.selectors";
import { WishlistItem } from "./data/wishlist.model";
import { WishlistService } from "./data/wishlist.service";

@Injectable({ providedIn: "root" })
export class WishlistStore {
  private readonly service = inject(WishlistService);
  private readonly accountStore = inject(Store);
  private readonly itemsState = signal<ReadonlyArray<WishlistItem>>([]);
  private readonly pendingIdsState = signal<ReadonlySet<number>>(new Set());
  private loadedForSession = false;
  private sessionVersion = 0;

  readonly items = this.itemsState.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly bookIds = computed(
    () => new Set(this.itemsState().map((item) => item.book.id))
  );

  constructor() {
    this.accountStore
      .select(selectLoginState)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.load();
        } else {
          this.clear();
        }
      });
  }

  load(force = false): void {
    if ((this.loadedForSession && !force) || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    const sessionVersion = this.sessionVersion;
    this.service
      .getWishlist()
      .pipe(
        finalize(() => {
          if (sessionVersion === this.sessionVersion) this.loading.set(false);
        })
      )
      .subscribe({
        next: (items) => {
          if (sessionVersion !== this.sessionVersion) return;
          this.itemsState.set(items);
          this.loadedForSession = true;
        },
        error: (error) => {
          if (sessionVersion !== this.sessionVersion) return;
          this.error.set(error.error?.message ?? error.message ?? "Unable to load wishlist");
        },
      });
  }

  toggle(bookId: number): void {
    if (this.isPending(bookId)) return;
    if (this.has(bookId)) {
      this.remove(bookId);
    } else {
      this.add(bookId);
    }
  }

  has(bookId: number): boolean {
    return this.bookIds().has(bookId);
  }

  isPending(bookId: number): boolean {
    return this.pendingIdsState().has(bookId);
  }

  clear(): void {
    this.sessionVersion++;
    this.itemsState.set([]);
    this.pendingIdsState.set(new Set());
    this.error.set(null);
    this.loading.set(false);
    this.loadedForSession = false;
  }

  private add(bookId: number): void {
    this.setPending(bookId, true);
    this.error.set(null);
    const sessionVersion = this.sessionVersion;
    this.service
      .addBook(bookId)
      .pipe(
        finalize(() => {
          if (sessionVersion === this.sessionVersion) {
            this.setPending(bookId, false);
          }
        })
      )
      .subscribe({
        next: (item) => {
          if (sessionVersion !== this.sessionVersion) return;
          this.itemsState.update((items) => [
            item,
            ...items.filter((existing) => existing.book.id !== bookId),
          ]);
          this.loadedForSession = true;
        },
        error: (error) => {
          if (sessionVersion !== this.sessionVersion) return;
          this.error.set(error.error?.message ?? error.message ?? "Unable to update wishlist");
        },
      });
  }

  private remove(bookId: number): void {
    this.setPending(bookId, true);
    this.error.set(null);
    const sessionVersion = this.sessionVersion;
    this.service
      .removeBook(bookId)
      .pipe(
        finalize(() => {
          if (sessionVersion === this.sessionVersion) {
            this.setPending(bookId, false);
          }
        })
      )
      .subscribe({
        next: () => {
          if (sessionVersion !== this.sessionVersion) return;
          this.itemsState.update((items) =>
            items.filter((item) => item.book.id !== bookId)
          );
        },
        error: (error) => {
          if (sessionVersion !== this.sessionVersion) return;
          this.error.set(error.error?.message ?? error.message ?? "Unable to update wishlist");
        },
      });
  }

  private setPending(bookId: number, pending: boolean): void {
    this.pendingIdsState.update((ids) => {
      const next = new Set(ids);
      if (pending) next.add(bookId);
      else next.delete(bookId);
      return next;
    });
  }
}
