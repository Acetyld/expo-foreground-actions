# expo-foreground-action(s)
*Can run 1 action at the time, it holds the ID of last and can only start new one if the old one is "finished" or when you use forceStopForegroundedAction*

All big apps use it, "foreground" actions, there wasn't really a good library that had it full focus on foreground. For example in whatsapp you press "send". 
What happens? On ios it will ask for more time, so if the users closes the app it will continue, same for android!

https://github.com/Acetyld/expo-foreground-actions

So.. i made this, mostly because we needed it for our app that has some heave CRUD stuff and small syncs all starting from frontend 🙂

Love to hear how other people feel about this subject
# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/foreground-actions.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/foreground-actions/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-foreground-actions
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.


### Configure for Android



# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
