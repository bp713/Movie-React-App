import { useSelector } from "react-redux";
import { selectSelectedMovie } from "../features/movieReducer";
import { SubmitReviewForm } from "./submitReviewForm";

export const SubmitReview = () => {
    const selectedMovie = useSelector(selectSelectedMovie);

    return (
        <div>
            {selectedMovie
                ? (selectedMovie?.title as any)
                    ? (("You have selected " + selectedMovie?.title) as any)
                    : "No Movie Title"
                : "No Movie Selected"}
            {selectedMovie && <p>Please leave a review below</p>}
            {selectedMovie && <SubmitReviewForm></SubmitReviewForm>}
        </div>
    );
};
