module.exports = {
  name: '@xxsnakerxx/react-native-components',
  preset: 'react-native',
  timers: 'fake',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules', '/test-utils.js'],
};
