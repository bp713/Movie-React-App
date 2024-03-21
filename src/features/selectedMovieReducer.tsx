import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { MovieType } from "./movieReducer";

interface selectedMovieType {
    movie: MovieType | null;
}

const initialState = {
    movie: null,
} satisfies selectedMovieType as selectedMovieType;

export const selectedMovieSlice = createSlice({
    name: "selectedMovie",
    initialState,
    reducers: {
        changeSelectedMovie: (state, action: PayloadAction<MovieType>) => {
            state.movie = action.payload;
        },
    },
});

export const { changeSelectedMovie } = selectedMovieSlice.actions;

export default selectedMovieSlice.reducer;

export const selectSelectedMovie = (state: RootState) => {
    return state.selectedMovie;
};
