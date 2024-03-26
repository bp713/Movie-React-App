import React from "react";
import { useSelector } from "react-redux";
import { selectNumberOfMovies } from "../features/movieReducer";
import { loadMovies } from "../features/movieReducer";
import { useAppDispatch } from "../app/hooks";
import Button from "@mui/material/Button";

const useLoadMovies = () => {
    const dispatch = useAppDispatch();
    return () => dispatch(loadMovies());
};

export const Header = () => {
    const numberOfMovies = useSelector(selectNumberOfMovies);
    const loadMovies = useLoadMovies();

    return (
        <div>
            <h2>Welcome to Movie database!</h2>
            <Button color="primary" variant="contained" onClick={loadMovies}>
                Refresh
            </Button>
            <p>Total movies displayed {numberOfMovies}</p>
        </div>
    );
};
