import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export type MovieState = {
    id: string;
    title: string;
    reviews: number[];
    filmCompanyId: string;
    cost: number;
    releaseYear: number;
};

const initialState: MovieState[] = [
    {
        id: "1",
        reviews: [6, 8, 3, 9, 8, 7, 8],
        title: "A Testing Film",
        filmCompanyId: "1",
        cost: 534,
        releaseYear: 2005,
    },
    {
        id: "2",
        reviews: [5, 7, 3, 4, 1, 6, 3],
        title: "Mock Test Film",
        filmCompanyId: "1",
        cost: 6234,
        releaseYear: 2006,
    },
];

export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<MovieState>) => {
            state.push(action.payload);
        },
    },
});

export const { add } = moviesSlice.actions;

export default moviesSlice.reducer;

export const selectNumberOfMovies = (state: RootState) => {
    return state.movies.length;
};

export const selectMovies = (state: RootState) => {
    return state.movies;
};
