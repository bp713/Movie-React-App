import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export type MovieType = {
    id: string;
    title: string;
    reviews: number[];
    filmCompanyId: string;
    cost: number;
    releaseYear: number;
};

export type MovieCompanyType = {
    id: string;
    name: string;
};

export type MovieReducerType = {
    moviesList: MovieType[];
    movieCompaniesList: MovieCompanyType[];
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string | undefined;
};

export const loadMovies = createAsyncThunk("movies/getAllMovies", async () => {
    try {
        const moviesResponse = await fetch("http://localhost:3000/movies");
        const movies = await moviesResponse.json();
        const movieCompanieResponse = await fetch(
            "http://localhost:3000/movieCompanies",
        );
        const movieCompanies = await movieCompanieResponse.json();
        return { movies, movieCompanies };
    } catch (error) {
        throw new Error("Error Fetching Movies");
    }
});

const initialState: MovieReducerType = {
    moviesList: [
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
    ],
    movieCompaniesList: [{ id: "1", name: "Test Productions" }],
    isLoading: false,
    hasError: false,
    errorMessage: undefined,
};

export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<MovieType>) => {
            state.moviesList.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadMovies.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        });
        builder.addCase(loadMovies.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            state.moviesList = action.payload.movies;
            state.movieCompaniesList = action.payload.movieCompanies;
        });
        builder.addCase(loadMovies.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.errorMessage = action.error.message;
            state.moviesList = [];
            state.movieCompaniesList = [];
        });
    },
});

export const { add } = moviesSlice.actions;

export default moviesSlice.reducer;

export const selectNumberOfMovies = (state: RootState) => {
    return state.movies.moviesList.length;
};

export const selectMovies = (state: RootState) => {
    return state.movies.moviesList;
};

export const selectError = (state: RootState) => {
    return state.movies.hasError;
};
export const selectErrorMessage = (state: RootState) => {
    return state.movies.errorMessage;
};
export const selectIsLoading = (state: RootState) => {
    return state.movies.isLoading;
};
export const selectMovieCompanies = (state: RootState) => {
    return state.movies.movieCompaniesList;
};
