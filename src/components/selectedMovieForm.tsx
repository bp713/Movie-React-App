import { useSelector } from "react-redux";
import { selectSelectedMovie } from "../features/selectedMovieReducer";

export const SelectedMovieForm = () => {
    const selectedMovie = useSelector(selectSelectedMovie);

    return (
        <div>
            {selectedMovie.movie
                ? (selectedMovie.movie?.title as any)
                    ? (("You have selected " +
                          selectedMovie.movie?.title) as any)
                    : "No Movie Title"
                : "No Movie Selected"}
            {selectedMovie && <p>Please leave a review below</p>}
            {selectedMovie && (
                <form onSubmit={() => {}}>
                    <label>
                        Review:
                        <input type="text" />
                    </label>
                </form>
            )}
        </div>
    );
};
