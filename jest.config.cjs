module.exports = {
    clearMocks: true,
    restoreMocks: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: [],
    testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    // globals: {
    //     fetch: global.fetch
    // }
}