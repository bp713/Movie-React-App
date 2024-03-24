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
    selectedMovie: MovieType | null;
    isLoading: boolean;
    loadingErrorMessage: string | undefined;
    submitReviewIsLoading: boolean;
    submitReviewErrorMessage: string | undefined;
    submitReviewSuccessMessage: string | undefined;
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
        throw new Error("Error Fetching Movies:" + error);
    }
});

export const submitReview = createAsyncThunk(
    "movies/submitReview",
    async (review: string) => {
        try {
            const postReviewResponse = await fetch(
                "http://localhost:3000/submitReview",
                { method: "POST", body: JSON.stringify({ review }) },
            );
            const response = await postReviewResponse.json();
            return response;
        } catch (error) {
            throw new Error("Error Submitting Review");
        }
    },
);

const initialState: MovieReducerType = {
    moviesList: [],
    movieCompaniesList: [],
    selectedMovie: null,
    isLoading: false,
    loadingErrorMessage: undefined,
    submitReviewErrorMessage: undefined,
    submitReviewIsLoading: false,
    submitReviewSuccessMessage: undefined,
};

export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        changeSelectedMovie: (state, action: PayloadAction<MovieType>) => {
            state.selectedMovie = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadMovies.pending, (state, action) => {
            state.isLoading = true;
            state.loadingErrorMessage = "";
        });
        builder.addCase(loadMovies.fulfilled, (state, action) => {
            state.isLoading = false;
            state.loadingErrorMessage = "";
            state.moviesList = action.payload.movies;
            state.movieCompaniesList = action.payload.movieCompanies;
        });
        builder.addCase(loadMovies.rejected, (state, action) => {
            state.isLoading = false;
            state.loadingErrorMessage = action.error.message;
            state.moviesList = [];
            state.movieCompaniesList = [];
        });
        builder.addCase(submitReview.pending, (state, action) => {
            state.submitReviewIsLoading = true;
            state.submitReviewErrorMessage = "";
        });
        builder.addCase(submitReview.fulfilled, (state, action) => {
            state.submitReviewIsLoading = false;
            state.submitReviewErrorMessage = "";
            state.submitReviewSuccessMessage = action.payload.message;
        });
        builder.addCase(submitReview.rejected, (state, action) => {
            state.submitReviewIsLoading = false;
            state.submitReviewErrorMessage = action.error.message;
            state.submitReviewSuccessMessage = undefined;
        });
    },
});

export const { changeSelectedMovie } = moviesSlice.actions;

export default moviesSlice.reducer;

export const selectNumberOfMovies = (state: RootState) => {
    return state.movies.moviesList.length;
};

export const selectMovies = (state: RootState) => {
    return state.movies.moviesList;
};

export const selectHasLoadingError = (state: RootState) => {
    return !!state.movies.loadingErrorMessage;
};
export const selectLoadingErrorMessage = (state: RootState) => {
    return state.movies.loadingErrorMessage;
};
export const selectIsLoading = (state: RootState) => {
    return state.movies.isLoading;
};
export const selectMovieCompanies = (state: RootState) => {
    return state.movies.movieCompaniesList;
};
export const selectSelectedMovie = (state: RootState) => {
    return state.movies.selectedMovie;
};
export const selectSubmitReviewHasError = (state: RootState) => {
    return !!state.movies.submitReviewErrorMessage;
};
export const selectSubmitReviewErrorMessage = (state: RootState) => {
    return state.movies.submitReviewErrorMessage;
};
export const selectSubmitReviewIsLoading = (state: RootState) => {
    return state.movies.submitReviewIsLoading;
};
export const selectSubmitReviewSuccessMessage = (state: RootState) => {
    return state.movies.submitReviewSuccessMessage;
};
