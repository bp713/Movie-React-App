import { useSelector } from "react-redux";
import {
    selectSubmitReviewErrorMessage,
    selectSubmitReviewIsLoading,
    selectSubmitReviewSuccessMessage,
    selectSubmitReviewHasError,
} from "../features/movieReducer";

export const SubmitReviewMessage = () => {
    const isLoading = useSelector(selectSubmitReviewIsLoading);
    const errorMessage = useSelector(selectSubmitReviewErrorMessage);
    const successMessage = useSelector(selectSubmitReviewSuccessMessage);
    const hasError = useSelector(selectSubmitReviewHasError);

    return (
        <div>
            {hasError && "Error: " + errorMessage}
            {successMessage && "Success: " + successMessage}
            {isLoading && "Loading"}{" "}
        </div>
    );
};
