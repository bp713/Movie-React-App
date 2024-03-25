import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormikProps } from "formik";

export const SubmitReviewForm = ({
    formik,
    selectedMovieTitle,
}: {
    formik: FormikProps<{ review: string }>;
    selectedMovieTitle: String | undefined;
}) => {
    return (
        <div>
            {selectedMovieTitle
                ? "You have selected " + selectedMovieTitle
                : "No Movie Title"}
            {<p>Please leave a review below</p>}
            <form role="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="review"
                    name="review"
                    label="review"
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
