module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      "type-enum": [
        2,
        "always",
        [
          "feat", // New feature
          "fix",  // Bug fix
          "chore", // Maintenance
          "docs",  // Documentation update
          "style", // Code style changes (formatting, missing semicolons)
          "refactor", // Code restructuring without behavior changes
          "test", // Adding tests
          "perf", // Performance improvements
          "ci", // CI/CD changes
        ],
      ],
      "subject-case": [2, "always", "sentence-case"],
    },
  };
  