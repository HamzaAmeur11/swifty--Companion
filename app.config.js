import 'dotenv/config';

export default {
  expo: {
    name: 'Swifty 42',
    slug: 'swifty42',
    version: '1.0.0',
    scheme: 'swifty42',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.swifty42.app',
    },
    android: {
      package: 'com.swifty42.app',
    },
    web: {
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      FT_CLIENT_ID: process.env.FT_CLIENT_ID,
      FT_CLIENT_SECRET: process.env.FT_CLIENT_SECRET,
    },
  },
};
