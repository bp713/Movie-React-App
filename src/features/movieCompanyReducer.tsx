import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface MovieCompanyState {
    id: string;
    name: string;
}

const initialState: MovieCompanyState[] = [
    { id: "1", name: "Test Productions" },
];

export const movieCompanysSlice = createSlice({
    name: "movieCompanys",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<MovieCompanyState>) => {
            state.push(action.payload);
        },
    },
});

export const { add } = movieCompanysSlice.actions;

export default movieCompanysSlice.reducer;

export const selectMovieCompanys = (state: RootState) => {
    return state.movieCompanys;
};
