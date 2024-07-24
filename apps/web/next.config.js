//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

if (!process.env.DATABASE_URL) {
  const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } =
    process.env;

  if (
    !DATABASE_USERNAME ||
    !DATABASE_PASSWORD ||
    !DATABASE_HOST ||
    !DATABASE_PORT ||
    !DATABASE_NAME
  ) {
    throw new Error('Database environment variables are not set properly.');
  }

  process.env.DATABASE_URL = `postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

  console.log('DATABASE_URL was built from variables: ', process.env.DATABASE_URL);
}

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'standalone',
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
