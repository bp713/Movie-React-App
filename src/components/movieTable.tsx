import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    selectMovies,
    MovieType,
    selectMovieCompanies,
    MovieCompanyType,
} from "../features/movieReducer";
import {
    changeSelectedMovie,
    selectSelectedMovie,
} from "../features/movieReducer";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";

interface tableRowData {
    id: string;
    title: string;
    averageReviewScore: number;
    companyName: string | undefined;
    movie: MovieType;
}

type Order = "asc" | "desc";

function createTableData(
    movies: MovieType[],
    movieCompanies: MovieCompanyType[],
): tableRowData[] {
    const tableData: tableRowData[] = [];

    movies.forEach((movie: MovieType) => {
        tableData.push({
            id: movie.id,
            title: movie.title,
            averageReviewScore:
                Math.round(
                    movie.reviews.reduce(
                        (acc: any, i: any) => (acc + i) / movie.reviews.length,
                        0,
                    ) * 100,
                ) / 100,
            companyName: movieCompanies.find(
                (f: any) => f.id === movie.filmCompanyId,
            )?.name,
            movie: movie,
        });
    });

    return tableData;
}

const sortTableData = (arr: tableRowData[], orderBy: Order) => {
    switch (orderBy) {
        case "asc":
        default:
            return arr.sort((a, b) =>
                a.averageReviewScore > b.averageReviewScore
                    ? 1
                    : b.averageReviewScore > a.averageReviewScore
                      ? -1
                      : 0,
            );
        case "desc":
            return arr.sort((a, b) =>
                a.averageReviewScore < b.averageReviewScore
                    ? 1
                    : b.averageReviewScore < a.averageReviewScore
                      ? -1
                      : 0,
            );
    }
};

export const MovieTable = () => {
    const movies = useSelector(selectMovies);
    const movieCompanies = useSelector(selectMovieCompanies);
    const selectedRow = useSelector(selectSelectedMovie);
    const dispatch = useDispatch();

    const [orderDirection, setOrderDirection] = useState<Order>("asc");

    const tableData = createTableData(movies, movieCompanies);
    const [rows, setRows] = useState(tableData);

    const handleSortRequest = () => {
        setRows(sortTableData(rows, orderDirection));
        setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="movies table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell onClick={handleSortRequest}>
                            <TableSortLabel
                                active={true}
                                direction={orderDirection}
                            >
                                Review
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Film Company</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                            aria-checked={selectedRow?.id === row.id}
                            selected={selectedRow?.id === row.id}
                            onClick={() =>
                                dispatch(changeSelectedMovie(row.movie))
                            }
                        >
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell>{row.averageReviewScore}</TableCell>
                            <TableCell>{row.companyName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
