import { useSelector, useDispatch } from "react-redux";
import { selectMovies } from "../features/movieReducer";
import { selectMovieCompanys } from "../features/movieCompanyReducer";
import { changeSelectedMovie } from "../features/selectedMovieReducer";

export const MovieTable = () => {
    const movies = useSelector(selectMovies);
    const movieCompanies = useSelector(selectMovieCompanys);
    const dispatch = useDispatch();

    return (
        <div>
            {movies.map((movie: any) => (
                <span
                    onClick={() => {
                        dispatch(changeSelectedMovie(movie));
                    }}
                >
                    {movie.title}{" "}
                    {movie.reviews
                        .reduce(
                            (acc: any, i: any) =>
                                (acc + i) / movie.reviews.length,
                            0,
                        )
                        ?.toString()
                        .substring(0, 3)}{" "}
                    {
                        movieCompanies.find(
                            (f: any) => f.id === movie.filmCompanyId,
                        )?.name
                    }
                    <br />
                </span>
            ))}
        </div>
    );
};
