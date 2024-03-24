import { useSelector } from "react-redux";
import { selectSelectedMovie } from "../features/movieReducer";
import { SubmitReviewForm } from "./submitReviewForm";
import { SubmitReviewModalForm } from "./submitReviewModalForm";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { submitReview } from "../features/movieReducer";
import { useFormik, FormikErrors } from "formik";
import { SubmitReviewMessage } from "./submitReviewMessage";

interface FormValues {
    review: string;
}

const validateForm = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (!values.review) {
        errors.review = "Review Required";
    } else if (values.review.length > 100) {
        errors.review = "Review too long.";
    }

    return errors;
};

export const SubmitReview = () => {
    const selectedMovie = useSelector(selectSelectedMovie);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const closeModal = () => {
        setIsFormVisible(false);
    };

    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
    });

    useEffect(() => {
        if (selectedMovie) {
            setIsFormVisible(true);
        }
    }, [selectedMovie, setIsFormVisible]);

    const dispatch = useAppDispatch();
    const formik = useFormik({
        initialValues: {
            review: "",
        },
        validate: validateForm,
        onSubmit: (values) => {
            dispatch(submitReview(values.review));
            setIsFormVisible(false);
        },
    });

    if (isFormVisible) {
        if (isMobile) {
            return (
                <div>
                    <SubmitReviewModalForm
                        formik={formik}
                        selectedMovieTitle={selectedMovie?.title}
                        isModalOpen={isFormVisible}
                        closeModal={closeModal}
                    ></SubmitReviewModalForm>
                </div>
            );
        }
        return (
            <div>
                <SubmitReviewForm
                    formik={formik}
                    selectedMovieTitle={selectedMovie?.title}
                ></SubmitReviewForm>
                <SubmitReviewMessage></SubmitReviewMessage>
            </div>
        );
    }

    return (
        <div>
            No Movie Selected
            <SubmitReviewMessage></SubmitReviewMessage>
        </div>
    );
};
