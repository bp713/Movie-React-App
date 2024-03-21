import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export type MovieCompanyType = {
    id: string;
    name: string;
};

const initialState: MovieCompanyType[] = [
    { id: "1", name: "Test Productions" },
];

export const movieCompanysSlice = createSlice({
    name: "movieCompanys",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<MovieCompanyType>) => {
            state.push(action.payload);
        },
    },
});

export const { add } = movieCompanysSlice.actions;

export default movieCompanysSlice.reducer;

export const selectMovieCompanys = (state: RootState) => {
    return state.movieCompanys;
};
