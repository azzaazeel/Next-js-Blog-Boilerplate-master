/* eslint-disable import/no-extraneous-dependencies */
module.exports = (phase) => {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  const baseUrl = '';

  const config = {
    poweredByHeader: false,
    trailingSlash: false,
    basePath: baseUrl || undefined,
    env: {
      baseUrl,
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
    reactStrictMode: true,
    turbopack: {},
  };

  return withBundleAnalyzer(config);
};
