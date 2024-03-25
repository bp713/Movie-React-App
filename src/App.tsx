import React from "react";
import { useAppDispatch } from "./app/hooks";
import { MovieApp } from "./components/movieApp";
import { loadMovies } from "./features/movieReducer";
import { useEffect } from "react";

export const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadMovies());
    });

    return (
        <div>
            <MovieApp></MovieApp>
        </div>
    );
};
