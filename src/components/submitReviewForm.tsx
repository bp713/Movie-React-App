import { useFormik, FormikErrors } from "formik";
import { Button, TextField } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { submitReview } from "../features/movieReducer";

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

export const SubmitReviewForm = () => {
    const dispatch = useAppDispatch();
    const formik = useFormik({
        initialValues: {
            review: "",
        },
        validate: validateForm,
        onSubmit: (values) => {
            dispatch(submitReview(values.review));
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="review"
                    name="review"
                    label="reivew"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.review && Boolean(formik.errors.review)
                    }
                    helperText={formik.touched.review && formik.errors.review}
                />
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};
