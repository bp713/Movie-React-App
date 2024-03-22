import { useSelector } from "react-redux";
import { selectNumberOfMovies } from "../features/movieReducer";
import { loadMovies } from "../features/movieReducer";
import { useAppDispatch } from "../app/hooks";

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
            <button onClick={loadMovies}>Refresh</button>
            <p>Total movies displayed {numberOfMovies}</p>
        </div>
    );
};
