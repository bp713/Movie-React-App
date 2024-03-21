import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { MovieState } from "./movieReducer";

interface selectedMovieState {
    movie: MovieState | null;
}

const initialState = {
    movie: null,
} satisfies selectedMovieState as selectedMovieState;

export const selectedMovieSlice = createSlice({
    name: "selectedMovie",
    initialState,
    reducers: {
        changeSelectedMovie: (state, action: PayloadAction<MovieState>) => {
            state.movie = action.payload;
        },
    },
});

export const { changeSelectedMovie } = selectedMovieSlice.actions;

export default selectedMovieSlice.reducer;

export const selectSelectedMovie = (state: RootState) => {
    return state.selectedMovie;
};
