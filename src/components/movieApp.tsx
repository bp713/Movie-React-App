import { useSelector } from "react-redux";
import { Header } from "../components/header";
import { MovieTable } from "../components/movieTable";
import { SubmitReview } from "../components/submitReview";
import {
    selectIsLoading,
    selectError,
    selectErrorMessage,
} from "../features/movieReducer";

export const MovieApp = () => {
    const isLoading = useSelector(selectIsLoading);
    const hasError = useSelector(selectError);
    const errorMessage = useSelector(selectErrorMessage);

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
