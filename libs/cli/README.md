# @verity/cli

This library provides a command line interface for the Verity CI integration.

## Usage

Before using the CLI, ensure the following environment variables are defined:

1. `VERITY_URL` - The URL of the Verity API instance.
2. `VERITY_TOKEN` - Authentication token for the Verity API, obtainable from the Verity UI.
3. `VERITY_APP_ID` - ID of the application to interact with, obtainable from the Verity UI.
4. `VERITY_APP_VERSION` - Current version of the application to interact with.

### Commands

```
verity version upsert
```

This command performs the following:

- Checks if the current version of the application is registered in Verity.
- If the application and version exist, it marks the version as built.
- If the version does not exist, it creates a new version and marks it as built.
