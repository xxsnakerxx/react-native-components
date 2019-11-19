const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = {
  name: '@xxsnakerxx/react-native-components',
  preset: '@testing-library/react-native',
  timers: 'fake',
  setupFiles: [
    ...jestPreset.setupFiles,
    './jest.setup.js',
  ],
  setupFilesAfterEnv: [
    '@testing-library/react-native/cleanup-after-each',
  ],
  testPathIgnorePatterns: [
    '/node_modules',
    '/test-utils.js',
  ],
};
