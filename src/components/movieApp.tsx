import { useSelector } from "react-redux";
import { Header } from "../components/header";
import { MovieTable } from "../components/movieTable";
import { SubmitReview } from "../components/submitReview";
import {
    selectIsLoading,
    selectHasLoadingError,
    selectLoadingErrorMessage,
} from "../features/movieReducer";

export const MovieApp = () => {
    const isLoading = useSelector(selectIsLoading);
    const hasError = useSelector(selectHasLoadingError);
    const errorMessage = useSelector(selectLoadingErrorMessage);

    if (hasError) {
        return (
            <div>
                <Header></Header>
                <h2>{errorMessage}</h2>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <Header></Header>
                <h2>Loading...</h2>
            </div>
        );
    }
    return (
        <div>
            <Header></Header>
            <br />
            <MovieTable></MovieTable>
            <br />
            <SubmitReview></SubmitReview>
        </div>
    );
};
