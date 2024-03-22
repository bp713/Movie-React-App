import { useSelector } from "react-redux";
import {
    selectSelectedMovie,
    selectSubmitReviewErrorMessage,
    selectSubmitReviewIsLoading,
    selectSubmitReviewSuccessMessage,
    selectSubmitReviewHasError,
} from "../features/movieReducer";
import { SubmitReviewForm } from "./submitReviewForm";

export const SubmitReview = () => {
    const selectedMovie = useSelector(selectSelectedMovie);
    const isLoading = useSelector(selectSubmitReviewIsLoading);
    const errorMessage = useSelector(selectSubmitReviewErrorMessage);
    const successMessage = useSelector(selectSubmitReviewSuccessMessage);
    const hasError = useSelector(selectSubmitReviewHasError);

    if (selectedMovie) {
        return (
            <div>
                {(selectedMovie?.title as any)
                    ? (("You have selected " + selectedMovie?.title) as any)
                    : "No Movie Title"}
                {<p>Please leave a review below</p>}
                {<SubmitReviewForm></SubmitReviewForm>}
                {hasError && "Error: " + errorMessage}
                {successMessage && "Success: " + successMessage}
                {isLoading && "Loading"}
            </div>
        );
    }

    return <div>No Movie Selected</div>;
};
