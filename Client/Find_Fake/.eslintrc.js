module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "plugins": [
    "react"
  ],
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    "no-console": "off",
    'prefer-promise-reject-errors': ["error", { "allowEmptyReject": true }]
  },
  "globals": {
    "fetch": false,
    "Platform": false
  }
};
