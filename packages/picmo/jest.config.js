module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy'
  },
  transform: {
    '\\.{jt}s$': 'ts-jest',
    '\\.svg$': 'jest-raw-loader'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};