import React from "react";
import { App } from "../App";
import { renderWithProviders } from "../utils/testutils";
import { screen } from "@testing-library/react";
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
        if (request == "http://localhost:3000/movies") {
            if (getMoviesReturnError) {
                return Promise.reject("Unable To return movies");
            }
            return Promise.resolve({
                json: () => Promise.resolve(moviesList),
            });
        }
        if (request == "http://localhost:3000/movieCompanies") {
            if (getMovieCompaniesReturnError) {
                return Promise.reject("Unable To return movie companies");
            }
            return Promise.resolve({
                json: () => Promise.resolve(movieCompaniesList),
            });
        }

        if (request == "http://localhost:3000/submitReview") {
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
            renderWithProviders(<App />);

            // When
            await new Promise(process.nextTick);

            // Then
            const errorMessage = screen.getByText(/Error/);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("when get movie companies data returns error", () => {
        test("should show error message", async () => {
            // Given
            mockServer({ getMovieCompaniesReturnError: true });
            renderWithProviders(<App />);

            // When
            await new Promise(process.nextTick);

            // Then
            const errorMessage = screen.getByText(/Error/);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("when data finishes loading successfully", () => {
        test("should show table of records", async () => {
            // Given
            mockServer();
            renderWithProviders(<App />);

            // When
            await new Promise(process.nextTick);

            // Then
            const table = screen.getByRole("table");
            expect(table).toBeInTheDocument();

            const tableRows = screen.getAllByRole("row");
            expect(tableRows.length).toBe(2);
        });

        describe("when user selects a row", () => {
            describe("when window size is large", () => {
                test("should show selected movie message", async () => {
                    // Given
                    const user = userEvent.setup();
                    mockServer();
                    renderWithProviders(<App />);
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
                    renderWithProviders(<App />);
                    await new Promise(process.nextTick);

                    // When
                    const rows = screen.getAllByRole("row");
                    await user.click(rows[1]);

                    // Then
                    const form = screen.getByRole("form");
                    expect(form).toBeInTheDocument();
                });

                describe("when user submits a review", () => {
                    test("should show success message", async () => {
                        const user = userEvent.setup();
                        mockServer();
                        renderWithProviders(<App />);
                        await new Promise(process.nextTick);

                        const rows = screen.getAllByRole("row");
                        await user.click(rows[1]);

                        const textbox = screen.getByRole("textbox");
                        await user.type(textbox, "A Review");

                        const button = screen.getByRole("button", {
                            name: /Submit/,
                        });
                        await user.click(button);
                        expect(global.fetch).toHaveBeenCalledTimes(3);
                        expect(global.fetch).toHaveBeenCalledWith(
                            "http://localhost:3000/submitReview",
                            { body: '{"review":"A Review"}', method: "POST" },
                        );

                        const successMessage = screen.getByText(/Success:/);
                        expect(successMessage).toBeInTheDocument();
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
                    renderWithProviders(<App />);
                    await new Promise(process.nextTick);

                    const rows = screen.getAllByRole("row");
                    await user.click(rows[1]);

                    const modal = screen.getByRole("dialog");
                    expect(modal).toBeInTheDocument();
                });

                describe("when user submits a review", () => {
                    test("should show success message", async () => {
                        const user = userEvent.setup();
                        mockServer();
                        renderWithProviders(<App />);
                        await new Promise(process.nextTick);

                        const rows = screen.getAllByRole("row");
                        await user.click(rows[1]);

                        const textbox = screen.getByRole("textbox");
                        await user.type(textbox, "A Review");

                        const button = screen.getByRole("button", {
                            name: /Submit/,
                        });
                        await user.click(button);
                        expect(global.fetch).toHaveBeenCalledTimes(3);
                        expect(global.fetch).toHaveBeenCalledWith(
                            "http://localhost:3000/submitReview",
                            { body: '{"review":"A Review"}', method: "POST" },
                        );

                        await new Promise(process.nextTick);
                        const successMessage = screen.getByText(/Success:/);
                        expect(successMessage).toBeInTheDocument();
                    });
                });
            });
        });
    });
});
