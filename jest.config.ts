import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  moduleDirectories: ['<rootDir>/node_modules'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}

export default config
