//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config) => {
    // Avoid bundling optional deps of elastic-apm-node by keeping it external in server build
    if (!config.externals) config.externals = [];
    config.externals.push({ 'elastic-apm-node': 'commonjs elastic-apm-node' });
    return config;
  },
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
