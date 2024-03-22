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
} from "../features/selectedMovieReducer";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface tableRowData {
    id: string;
    title: string;
    averageReviewScore: string;
    companyName: string | undefined;
    movie: MovieType;
}

function createTableData(
    movies: MovieType[],
    movieCompanies: MovieCompanyType[],
): tableRowData[] {
    const tableData: tableRowData[] = [];

    movies.forEach((movie: MovieType) => {
        tableData.push({
            id: movie.id,
            title: movie.title,
            averageReviewScore: movie.reviews
                .reduce(
                    (acc: any, i: any) => (acc + i) / movie.reviews.length,
                    0,
                )
                ?.toString()
                .substring(0, 3),
            companyName: movieCompanies.find(
                (f: any) => f.id === movie.filmCompanyId,
            )?.name,
            movie: movie,
        });
    });

    return tableData;
}

export const MovieTable = () => {
    const movies = useSelector(selectMovies);
    const movieCompanies = useSelector(selectMovieCompanies);
    const selectedRow = useSelector(selectSelectedMovie);
    const dispatch = useDispatch();

    const tableData = createTableData(movies, movieCompanies);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="movies table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Review</TableCell>
                        <TableCell>Film Company</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                            aria-checked={selectedRow.movie?.id === row.id}
                            selected={selectedRow.movie?.id === row.id}
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
