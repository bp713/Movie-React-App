import { useSelector } from "react-redux";
import { selectNumberOfMovies } from "../features/movieReducer";

export const Header = () => {
    const numberOfMovies = useSelector(selectNumberOfMovies);

    return (
        <div>
            <h2>Welcome to Movie database!</h2>
            <button>Refresh</button>
            <p>Total movies displayed {numberOfMovies}</p>
        </div>
    );
};
