//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const { i18n } = require('./next-i18next.config')
const PLATFORM_ENV = process.env.PLATFORM_ENV || 'local'

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/order',
        permanent: true
      }
    ]
  },
  experimental: {
    appDir: false
  },
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    PLATFORM_ENV,
    API_DOMAIN: process.env.API_DOMAIN,
    NAVERMAP_KEY: process.env.NAVERMAP_KEY,
    GOOGLEMAP_KEY: process.env.GOOGLEMAP_KEY,
    GOOGLEMAP_ID: process.env.GOOGLEMAP_ID,
    STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY
  },
  images: {
    domains: ['localhost']
  },
  eslint: {
    ignoreDuringBuilds: false // build시 eslint 발생 하면 빌드 에러 기능 true: eslint 에러 -> 빌드 에러 발생
  },
  webpack(config) {
    // svg를 컴포넌트로 가져와서 사용가능
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },
  i18n
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
