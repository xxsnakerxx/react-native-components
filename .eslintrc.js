module.exports = {
  extends: '@xxsnakerxx/eslint-config/react-native',

  rules: {
    'react/prop-types': [2,
      {
        ignore: [
          'children',
        ],
      },
    ],
  }
};
