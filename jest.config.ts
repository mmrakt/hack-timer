import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleDirectories: ['<rootDir>/node_modules'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}

export default config
