# @verityjs/client

This library provides a client for the Verity that allows you to load dependencies.

## Usage

Import and initiate the client with the following code:

```typescript
import { VerityClient } from '@verityjs/client';

const config: VerityClientConfig = {
  verityUrl: /* URL of the Verity API instance */,
  applicationId: /* ID of the current application obtainable from Verity Admin panel */,
  applicationVersion: /* Current version of the application */,
};

const client = new VerityClient(config);
```

### Methods

`loadDependencies` - Loads dependencies for current application version from the Verity API.

```typescript
client
  .getDependencies()
  .then(() => {
    // Dependencies loaded
  })
  .catch((error) => {
    // Error loading dependencies
  });
```
