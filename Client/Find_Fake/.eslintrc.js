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
    // "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off'
  },
  "globals": {
    "fetch": false,
    "Platform": false
  }
};
