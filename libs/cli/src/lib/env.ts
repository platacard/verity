export enum VerityCiContextKeys {
  VERITY_URL = 'VERITY_URL',
  VERITY_TOKEN = 'VERITY_TOKEN',
  VERITY_APP_ID = 'VERITY_APP_ID',
  VERITY_APP_VERSION = 'VERITY_APP_VERSION',
}

export const validateEnv = () => {
  console.log('Validating environment variables...');
  const missingVars = Object.values(VerityCiContextKeys).filter((key) => !process.env[key]);

  if (missingVars.length) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};
