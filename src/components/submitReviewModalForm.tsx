import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { FormikProps } from "formik";
import { MovieType } from "../features/movieReducer";

export const SubmitReviewModalForm = ({
    formik,
    isModalOpen,
    selectedMovieTitle,
    closeModal,
}: {
    formik: FormikProps<{ review: string }>;
    isModalOpen: boolean;
    selectedMovieTitle: string | undefined;
    closeModal: Function;
}) => {
    const handleClose = () => {
        closeModal();
    };

    return (
        <div>
            <Dialog
                open={isModalOpen}
                PaperProps={{
                    component: "form",
                    onSubmit: formik.handleSubmit,
                }}
            >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedMovieTitle
                            ? "You have selected " + selectedMovieTitle
                            : "No Movie Title"}
                    </DialogContentText>
                    <TextField
                        fullWidth
                        id="review"
                        name="review"
                        label="review"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
