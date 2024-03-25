import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movieReducer";

const store = configureStore({
    reducer: {
        movies: movieReducer,
    },
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: { movies: movieReducer },
        preloadedState,
    });
};

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type Store = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
