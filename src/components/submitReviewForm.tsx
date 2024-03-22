import { useFormik, FormikErrors } from "formik";
import { Button, TextField } from "@mui/material";

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
    const formik = useFormik({
        initialValues: {
            review: "",
        },
        validate: validateForm,
        onSubmit: (values) => {
            console.log(values);
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
