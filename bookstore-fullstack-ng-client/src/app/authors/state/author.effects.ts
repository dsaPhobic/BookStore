import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { AuthorService } from "../data/author.service";
import { authorActions } from "./author.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { selectAuthorState } from "./author.selectors";

@Injectable()
export class AuthorEffects {
  actions$ = inject(Actions);
  authorService = inject(AuthorService);
  store = inject(Store);

  loadAuthors = createEffect(() =>
    this.actions$.pipe(
      ofType(authorActions.loadAuthors),
      concatLatestFrom(() => [this.store.select(selectAuthorState)]),
      switchMap(([action, state]) =>
        this.authorService
          .getAuthors({
            pageSize: state.pageSize,
            pageNumber: state.pageNumber,
            searchTerm: state.searchTerm ?? "",
            sortBy: state.sortBy,
          })
          .pipe(
            switchMap((data) => {
              // can I dispatch an action here?
              return [
                authorActions.loadAuthorsSuccess({ authors: data.items }),
                authorActions.setTotalCount({ totalCount: data.totalCount }),
              ];
            }),
            catchError((error) =>
              of(authorActions.loadAuthorsFailure({ error }))
            )
          )
      )
    )
  );

  addAuthor = createEffect(() =>
    this.actions$.pipe(
      ofType(authorActions.addAuthor),
      switchMap((action) =>
        this.authorService.addAuthor(action.author).pipe(
          map((author) => authorActions.addAuthorSuccess({ author })),
          catchError((error) => of(authorActions.addAuthorFailure({ error })))
        )
      )
    )
  );

  updateAuthor = createEffect(() =>
    this.actions$.pipe(
      ofType(authorActions.updateAuthor),
      switchMap((action) =>
        this.authorService.updateAuthor(action.author).pipe(
          map((_) =>
            authorActions.updateAuthorSuccess({ author: action.author })
          ),
          catchError((error) =>
            of(authorActions.updateAuthorFailure({ error }))
          )
        )
      )
    )
  );

  deleteAuthor = createEffect(() =>
    this.actions$.pipe(
      ofType(authorActions.deleteAuthor),
      switchMap((action) =>
        this.authorService.deleteAuthor(action.id).pipe(
          map((_) => authorActions.deleteAuthorSuccess({ id: action.id })),
          catchError((error) =>
            of(authorActions.deleteAuthorFailure({ error }))
          )
        )
      )
    )
  );
}
