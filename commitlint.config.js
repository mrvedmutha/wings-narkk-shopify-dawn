module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new section, snippet, feature
        'fix',      // bug fix
        'style',    // CSS / visual changes
        'refactor', // restructuring without behaviour change
        'chore',    // config, tooling, dependencies
        'docs',     // documentation only
        'perf',     // performance improvement
        'revert',   // reverting a previous commit
      ],
    ],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],
    'scope-max-length': [2, 'always', 30],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
