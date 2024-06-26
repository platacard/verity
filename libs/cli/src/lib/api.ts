import process from 'node:process';
import axios from 'axios';

import { VerityCiContextKeys } from './env';

const VERITY_URL = process.env[VerityCiContextKeys.VERITY_URL];
const VERITY_TOKEN = process.env[VerityCiContextKeys.VERITY_TOKEN];
const VERITY_APP_ID = process.env[VerityCiContextKeys.VERITY_APP_ID];
const VERITY_APP_VERSION = process.env[VerityCiContextKeys.VERITY_APP_VERSION];

const requestConfig = {
  headers: {
    Authorization: VERITY_TOKEN,
  },
};

export const getApp = async () => {
  const appVersionResp = await axios
    .get(`${VERITY_URL}/apps/${VERITY_APP_ID}`, requestConfig)
    .catch(() => null);

  return appVersionResp?.data ?? null;
};

export const getAppVersions = async () => {
  const appVersionResp = await axios
    .get(`${VERITY_URL}/apps/${VERITY_APP_ID}/versions`, requestConfig)
    .catch(() => null);

  return appVersionResp?.data ?? [];
};

export const createVersion = async () => {
  const versionResp = await axios
    .post(
      `${VERITY_URL}/versions`,
      JSON.stringify({
        appId: VERITY_APP_ID && parseInt(VERITY_APP_ID),
        value: VERITY_APP_VERSION,
        builtAt: new Date().toISOString(),
      }),
      requestConfig,
    )
    .catch(() => {
      console.error('Error creating Version');
      process.exit(1);
    });

  return versionResp.data;
};

export const markVersionAsBuilt = async (versionId: number) => {
  const versionResp = await axios
    .put(
      `${VERITY_URL}/versions/${versionId}`,
      {
        builtAt: new Date().toISOString(),
      },
      requestConfig,
    )
    .catch(() => {
      console.error('Error marking Version as built');
      process.exit(1);
    });

  return versionResp.data;
};
