export enum VerityCiContextKeys {
  VERITY_URL = 'VERITY_URL',
  VERITY_TOKEN = 'VERITY_TOKEN',
  VERITY_APP_ID = 'VERITY_APP_ID',
  VERITY_APP_VERSION = 'VERITY_APP_VERSION',
}

export const validateEnv = () => {
  const missingVariables = Object.values(VerityCiContextKeys).filter((key) => !process.env[key]);

  if (missingVariables.length) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }
};
