import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movieReducer";
import movieCompanyReducer from "../features/movieCompanyReducer";
import selectedMovieReducer from "../features/selectedMovieReducer";

const store = configureStore({
    reducer: {
        movies: movieReducer,
        movieCompanys: movieCompanyReducer,
        selectedMovie: selectedMovieReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
