import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movieReducer";

const store = configureStore({
    reducer: {
        movies: movieReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
