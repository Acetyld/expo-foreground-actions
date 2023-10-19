const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");
const { getMainApplicationOrThrow } = AndroidConfig.Manifest;

module.exports = function withBackgroundActions(config) {
  return withAndroidManifest(config, async (config) => {
    const application = getMainApplicationOrThrow(config.modResults);
    const service = application.service ? application.service : [];

    config.modResults = {
      manifest: {
        ...config.modResults.manifest,
        application: [
          {
            ...application,
            service: [
              ...service,
              {
                $: {
                  "android:name":
                    "expo.modules.foregroundactions.ExpoForegroundActionsService",
                },
              },
            ],
          },
        ],
      },
    };

    return config;
  });
};
