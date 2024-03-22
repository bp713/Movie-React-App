import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movieReducer";
import selectedMovieReducer from "../features/selectedMovieReducer";

const store = configureStore({
    reducer: {
        movies: movieReducer,
        selectedMovie: selectedMovieReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
