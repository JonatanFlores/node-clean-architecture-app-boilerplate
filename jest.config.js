module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/infra/repos/mongo/helpers/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  clearMocks: true,
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.ts'],
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  preset: '@shelf/jest-mongodb',
  transform: {
    '\\.ts$': 'ts-jest'
  },
  setupFiles: ['dotenv/config']
}
