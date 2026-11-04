import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { GenreModel } from "../data/genre.model";
import { HttpErrorResponse } from "@angular/common/http";

export const GenreActions = createActionGroup({
  source: "Genre",
  events: {
    "Load Genre": emptyProps(),
    "Load Genre Success": props<{ genres: GenreModel[] }>(),
    "Load Genre Failure": props<{ error: HttpErrorResponse }>(),
    "Add Genre": props<{ genre: GenreModel }>(),
    "Add Genre Success": props<{ genre: GenreModel }>(),
    "Add Genre Failure": props<{ error: HttpErrorResponse }>(),
    "Update Genre": props<{ genre: GenreModel }>(),
    "Update Genre Success": props<{ genre: GenreModel }>(),
    "Update Genre Failure": props<{ error: HttpErrorResponse }>(),
    "Delete Genre": props<{ id: number }>(),
    "Delete Genre Success": props<{ id: number }>(),
    "Delete Genre Failure": props<{ error: HttpErrorResponse }>(),
  },
});
