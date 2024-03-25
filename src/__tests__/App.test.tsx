import React from "react";
import { App } from "../App";
import { renderWithProviders } from "../utils/testutils";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import userEvent from "@testing-library/user-event";
import { MovieType, MovieCompanyType } from "../features/movieReducer";

type MockServerOptions = {
    moviesList?: MovieType[];
    movieCompanyList?: MovieCompanyType[];
    getMoviesReturnError?: boolean;
    getMovieCompaniesReturnError?: boolean;
    submitReviewMessage?: String;
    submitReviewReturnError?: boolean;
};

const mockServer = (options?: MockServerOptions) => {
    const moviesList = options?.moviesList || [
        {
            id: "1",
            title: "Something",
            reviews: [5, 4, 3],
            filmCompanyId: "1",
            cost: 10,
            releaseYear: 2015,
        },
    ];
    const movieCompaniesList = options?.movieCompanyList || [
        {
            id: "1",
            name: "Something",
        },
    ];
    const getMoviesReturnError = options?.getMoviesReturnError || false;
    const getMovieCompaniesReturnError =
        options?.getMovieCompaniesReturnError || false;

    const submitReviewMessage =
        options?.submitReviewMessage || "Review Submitted";
    const submitReviewError = options?.submitReviewReturnError || false;

    global.fetch = jest.fn((request) => {
        if (request == "http://localhost:4321/movies") {
            if (getMoviesReturnError) {
                return Promise.reject("Unable To return movies");
            }
            return Promise.resolve({
                json: () => Promise.resolve(moviesList),
            });
        }
        if (request == "http://localhost:4321/movieCompanies") {
            if (getMovieCompaniesReturnError) {
                return Promise.reject("Unable To return movie companies");
            }
            return Promise.resolve({
                json: () => Promise.resolve(movieCompaniesList),
            });
        }

        if (request == "http://localhost:4321/submitReview") {
            if (submitReviewError) {
                return Promise.reject("Unable To Submit Review");
            }
            return Promise.resolve({
                json: () => Promise.resolve({ message: submitReviewMessage }),
            });
        }
    }) as jest.Mock;
};
describe("App", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("When data is loading", () => {
        test("should show loading message", () => {
            // Given
            mockServer();

            // When
            renderWithProviders(<App />);

            // Then
            const loadingMessage = screen.getByText(/Loading.../);
            expect(loadingMessage).toBeInTheDocument();
        });
    });

    describe("when get movie data returns error", () => {
        test("should show error message", async () => {
            // Given
            mockServer({ getMoviesReturnError: true });

            // When
            await waitFor(async () => {
                renderWithProviders(<App />);
            });

            // Then
            const errorMessage = screen.getByText(/Error/);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("when get movie companies data returns error", () => {
        test("should show error message", async () => {
            // Given
            mockServer({ getMovieCompaniesReturnError: true });

            // When
            await waitFor(async () => {
                renderWithProviders(<App />);
            });

            // Then
            const errorMessage = screen.getByText(/Error/);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("refresh button", () => {
        test("should reload movies", async () => {
            // Given
            const user = userEvent.setup();
            mockServer();
            await waitFor(async () => {
                renderWithProviders(<App />);
            });

            const newMovies = [
                {
                    id: "1",
                    title: "new movie",
                    reviews: [5, 4, 3],
                    filmCompanyId: "1",
                    cost: 10,
                    releaseYear: 2015,
                },
            ];

            const newMovieCompanies = [
                {
                    id: "1",
                    name: "new movie company",
                },
            ];

            mockServer({
                moviesList: newMovies,
                movieCompanyList: newMovieCompanies,
            });

            // When
            const button = screen.getByRole("button", {
                name: /Refresh/,
            });
            await user.click(button);

            // Then
            const tableRows = screen.getAllByRole("row");
            expect(tableRows.length).toBe(2);
            expect(tableRows[0].textContent).toBe("TitleReviewFilm Company");
            expect(tableRows[1].textContent).toBe(
                "new movie1.63new movie company",
            );
        });
    });

    describe("when data finishes loading successfully", () => {
        test("should show table of records", async () => {
            // Given
            mockServer();
            await waitFor(async () => {
                renderWithProviders(<App />);
            });

            // When
            await new Promise(process.nextTick);

            // Then
            const table = screen.getByRole("table");
            expect(table).toBeInTheDocument();

            const tableRows = screen.getAllByRole("row");
            expect(tableRows.length).toBe(2);
            expect(tableRows[0].textContent).toBe("TitleReviewFilm Company");
            expect(tableRows[1].textContent).toBe("Something1.63Something");
        });

        describe("table sort", () => {
            test("should sort table of records", async () => {
                // Given
                const user = userEvent.setup();
                const moviesList = [
                    {
                        id: "1",
                        title: "Highest",
                        reviews: [5, 4, 3],
                        filmCompanyId: "1",
                        cost: 10,
                        releaseYear: 2015,
                    },
                    {
                        id: "2",
                        title: "Lowest",
                        reviews: [1, 1, 1],
                        filmCompanyId: "1",
                        cost: 10,
                        releaseYear: 2015,
                    },
                    {
                        id: "3",
                        title: "Middle",
                        reviews: [1, 2, 2],
                        filmCompanyId: "1",
                        cost: 10,
                        releaseYear: 2015,
                    },
                ];
                mockServer({ moviesList });
                await waitFor(async () => {
                    renderWithProviders(<App />);
                });

                // When
                await new Promise(process.nextTick);

                // Then
                const reviewColumnHeader = screen.getByRole("columnheader", {
                    name: /Review/,
                });
                await user.click(reviewColumnHeader);

                const tableRowsAsc = screen.getAllByRole("row");
                expect(tableRowsAsc.length).toBe(4);
                expect(tableRowsAsc[1].textContent).toBe("Lowest0.48Something");
                expect(tableRowsAsc[2].textContent).toBe("Middle0.93Something");
                expect(tableRowsAsc[3].textContent).toBe(
                    "Highest1.63Something",
                );

                await user.click(reviewColumnHeader);
                const tableRowsDsc = screen.getAllByRole("row");
                expect(tableRowsDsc.length).toBe(4);
                expect(tableRowsDsc[1].textContent).toBe(
                    "Highest1.63Something",
                );
                expect(tableRowsDsc[2].textContent).toBe("Middle0.93Something");
                expect(tableRowsDsc[3].textContent).toBe("Lowest0.48Something");
            });
        });

        describe("when user selects a row", () => {
            describe("when window size is large", () => {
                test("should show selected movie message", async () => {
                    // Given
                    const user = userEvent.setup();
                    mockServer();
                    await waitFor(async () => {
                        renderWithProviders(<App />);
                    });
                    await new Promise(process.nextTick);

                    // When
                    const rows = screen.getAllByRole("row");
                    await user.click(rows[1]);

                    // Then
                    const selectedMovieMessage =
                        screen.getByText(/You have selected/);
                    expect(selectedMovieMessage).toBeInTheDocument();
                });

                test("should show review form", async () => {
                    // Given
                    const user = userEvent.setup();
                    mockServer();
                    await waitFor(async () => {
                        renderWithProviders(<App />);
                    });
                    await new Promise(process.nextTick);

                    // When
                    const rows = screen.getAllByRole("row");
                    await user.click(rows[1]);

                    // Then
                    const form = screen.getByRole("form");
                    expect(form).toBeInTheDocument();
                });

                describe("when user submits a review", () => {
                    describe("when there is no text", () => {
                        test("should show review required message and not submit", async () => {
                            // Given
                            const user = userEvent.setup();
                            mockServer();
                            await waitFor(async () => {
                                renderWithProviders(<App />);
                            });
                            await new Promise(process.nextTick);

                            const rows = screen.getAllByRole("row");
                            await user.click(rows[1]);

                            // When
                            const button = screen.getByRole("button", {
                                name: /Submit/,
                            });
                            await user.click(button);

                            // Then
                            // called only twice for fetching data
                            expect(global.fetch).toHaveBeenCalledTimes(2);

                            const reviewRequiredMessage =
                                screen.getByText("Review Required");
                            expect(reviewRequiredMessage).toBeInTheDocument();
                        });
                    });

                    describe("when the text is over 100 characters", () => {
                        test("should show review required message and not submit", async () => {
                            // Given
                            const user = userEvent.setup();
                            mockServer();
                            await waitFor(async () => {
                                renderWithProviders(<App />);
                            });
                            await new Promise(process.nextTick);

                            const rows = screen.getAllByRole("row");
                            await user.click(rows[1]);

                            const textbox = screen.getByRole("textbox");
                            await user.type(
                                textbox,
                                "A really long Review. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            );

                            // When
                            const button = screen.getByRole("button", {
                                name: /Submit/,
                            });
                            await user.click(button);

                            // Then
                            // called only twice for fetching data
                            expect(global.fetch).toHaveBeenCalledTimes(2);

                            const reviewRequiredMessage =
                                screen.getByText("Review too long.");
                            expect(reviewRequiredMessage).toBeInTheDocument();
                        });
                    });

                    describe("when the text is less than 100 characters", () => {
                        describe("when server returns a success message", () => {
                            test("should show success message", async () => {
                                // Given
                                const user = userEvent.setup();
                                mockServer();
                                await waitFor(async () => {
                                    renderWithProviders(<App />);
                                });
                                await new Promise(process.nextTick);

                                const rows = screen.getAllByRole("row");
                                await user.click(rows[1]);

                                const textbox = screen.getByRole("textbox");
                                await user.type(textbox, "A Review");

                                // When
                                const button = screen.getByRole("button", {
                                    name: /Submit/,
                                });
                                await user.click(button);

                                // Then
                                expect(global.fetch).toHaveBeenCalledTimes(3);
                                expect(global.fetch).toHaveBeenCalledWith(
                                    "http://localhost:4321/submitReview",
                                    {
                                        body: '{"review":"A Review"}',
                                        method: "POST",
                                    },
                                );

                                const successMessage =
                                    screen.getByText(/Success:/);
                                expect(successMessage).toBeInTheDocument();
                            });
                        });

                        describe("when server returns an error message", () => {
                            test("should show error message", async () => {
                                // Given
                                const user = userEvent.setup();
                                mockServer({ submitReviewReturnError: true });
                                await waitFor(async () => {
                                    renderWithProviders(<App />);
                                });
                                await new Promise(process.nextTick);

                                const rows = screen.getAllByRole("row");
                                await user.click(rows[1]);

                                const textbox = screen.getByRole("textbox");
                                await user.type(textbox, "A Review");

                                // When
                                const button = screen.getByRole("button", {
                                    name: /Submit/,
                                });
                                await user.click(button);

                                // Then
                                expect(global.fetch).toHaveBeenCalledTimes(3);
                                expect(global.fetch).toHaveBeenCalledWith(
                                    "http://localhost:4321/submitReview",
                                    {
                                        body: '{"review":"A Review"}',
                                        method: "POST",
                                    },
                                );

                                const errorMessage = screen.getByText(/Error:/);
                                expect(errorMessage).toBeInTheDocument();
                            });
                        });
                    });
                });
            });

            describe("when window size is small", () => {
                beforeEach(() => {
                    window.innerWidth = 500;
                });

                test("should show submit review modal", async () => {
                    const user = userEvent.setup();
                    mockServer();
                    await waitFor(async () => {
                        renderWithProviders(<App />);
                    });
                    await new Promise(process.nextTick);

                    const rows = screen.getAllByRole("row");
                    await user.click(rows[1]);

                    const modal = screen.getByRole("dialog");
                    expect(modal).toBeInTheDocument();
                });

                describe("when modal cancel button is clicked", () => {
                    test("should show submit review modal", async () => {
                        // Given
                        const user = userEvent.setup();
                        mockServer();
                        await waitFor(async () => {
                            renderWithProviders(<App />);
                        });
                        await new Promise(process.nextTick);

                        const rows = screen.getAllByRole("row");
                        await user.click(rows[1]);

                        // When
                        const button = screen.getByRole("button", {
                            name: /Cancel/,
                        });
                        await user.click(button);

                        // Then
                        const modal = screen.queryByRole("dialog");
                        expect(modal).not.toBeInTheDocument();
                    });
                });

                describe("when user submits a review", () => {
                    describe("when there is no text", () => {
                        test("should show review required message and not submit", async () => {
                            // Given
                            const user = userEvent.setup();
                            mockServer();
                            await waitFor(async () => {
                                renderWithProviders(<App />);
                            });
                            await new Promise(process.nextTick);

                            const rows = screen.getAllByRole("row");
                            await user.click(rows[1]);

                            // When
                            const button = screen.getByRole("button", {
                                name: /Submit/,
                            });
                            await user.click(button);

                            // Then
                            // called only twice for fetching data
                            expect(global.fetch).toHaveBeenCalledTimes(2);

                            const reviewRequiredMessage =
                                screen.getByText("Review Required");
                            expect(reviewRequiredMessage).toBeInTheDocument();
                        });
                    });

                    describe("when the text is over 100 characters", () => {
                        test("should show review required message and not submit", async () => {
                            // Given
                            const user = userEvent.setup();
                            mockServer();
                            await waitFor(async () => {
                                renderWithProviders(<App />);
                            });
                            await new Promise(process.nextTick);

                            const rows = screen.getAllByRole("row");
                            await user.click(rows[1]);

                            const textbox = screen.getByRole("textbox");
                            await user.type(
                                textbox,
                                "A really long Review. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            );

                            // When
                            const button = screen.getByRole("button", {
                                name: /Submit/,
                            });
                            await user.click(button);

                            // Then
                            // called only twice for fetching data
                            expect(global.fetch).toHaveBeenCalledTimes(2);

                            const reviewRequiredMessage =
                                screen.getByText("Review too long.");
                            expect(reviewRequiredMessage).toBeInTheDocument();
                        });
                    });

                    describe("when the text is less than 100 characters", () => {
                        describe("when server returns a success message", () => {
                            test("should show success message", async () => {
                                // Given
                                const user = userEvent.setup();
                                mockServer();
                                await waitFor(async () => {
                                    renderWithProviders(<App />);
                                });
                                await new Promise(process.nextTick);

                                const rows = screen.getAllByRole("row");
                                await user.click(rows[1]);

                                const textbox = screen.getByRole("textbox");
                                await user.type(textbox, "A Review");

                                // When
                                const button = screen.getByRole("button", {
                                    name: /Submit/,
                                });
                                await user.click(button);

                                // Then
                                expect(global.fetch).toHaveBeenCalledTimes(3);
                                expect(global.fetch).toHaveBeenCalledWith(
                                    "http://localhost:4321/submitReview",
                                    {
                                        body: '{"review":"A Review"}',
                                        method: "POST",
                                    },
                                );

                                const successMessage =
                                    screen.getByText(/Success:/);
                                expect(successMessage).toBeInTheDocument();
                            });
                        });

                        describe("when server returns an error message", () => {
                            test("should show error message", async () => {
                                // Given
                                const user = userEvent.setup();
                                mockServer({ submitReviewReturnError: true });
                                await waitFor(async () => {
                                    renderWithProviders(<App />);
                                });
                                await new Promise(process.nextTick);

                                const rows = screen.getAllByRole("row");
                                await user.click(rows[1]);

                                const textbox = screen.getByRole("textbox");
                                await user.type(textbox, "A Review");

                                // When
                                const button = screen.getByRole("button", {
                                    name: /Submit/,
                                });
                                await user.click(button);

                                // Then
                                expect(global.fetch).toHaveBeenCalledTimes(3);
                                expect(global.fetch).toHaveBeenCalledWith(
                                    "http://localhost:4321/submitReview",
                                    {
                                        body: '{"review":"A Review"}',
                                        method: "POST",
                                    },
                                );

                                const errorMessage = screen.getByText(/Error:/);
                                expect(errorMessage).toBeInTheDocument();
                            });
                        });
                    });
                });
            });
        });
    });
});
