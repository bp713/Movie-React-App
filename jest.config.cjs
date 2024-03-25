const config = {
    testEnvironment: "jsdom",
    setupFiles: ["./jest.polyfills.cjs"],
    testEnvironmentOptions: {
        customExportConditions: [""],
    },
};

module.exports = config;
