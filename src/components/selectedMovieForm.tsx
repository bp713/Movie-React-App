import { useSelector } from "react-redux";
import { selectSelectedMovie } from "../features/movieReducer";
import { useFormik, FormikErrors } from "formik";
import { Button, TextField } from "@mui/material";

interface FormValues {
    review: string;
}

const validateForm = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {
        review: "",
    };

    if (!values.review) {
        errors.review = "Review Required";
    } else if (values.review.length > 100) {
        errors.review = "Review too long.";
    }

    return errors;
};

export const SelectedMovieForm = () => {
    const selectedMovie = useSelector(selectSelectedMovie);

    const formik = useFormik({
        initialValues: {
            review: "",
        },
        validate: validateForm,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div>
            {selectedMovie
                ? (selectedMovie?.title as any)
                    ? (("You have selected " + selectedMovie?.title) as any)
                    : "No Movie Title"
                : "No Movie Selected"}
            {selectedMovie && <p>Please leave a review below</p>}
            {selectedMovie && (
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
                            formik.touched.review &&
                            Boolean(formik.errors.review)
                        }
                        helperText={
                            formik.touched.review && formik.errors.review
                        }
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
            )}
        </div>
    );
};
