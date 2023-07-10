
module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          canvas: require.resolve('canvas'),
        };
      }
      return config;
    },
  };