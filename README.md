<div align="center">
<h1 align="center">
<img src="https://github.com/Acetyld/expo-foreground-actions/blob/main/assets/logo.png" width="100" />
<br>EXPO-FOREGROUND-ACTIONS</h1>
<h3>◦ Running Foreground actions for Android/IOS</h3>
<h3>◦ Developed with the software and tools below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/React Native-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Swift-F05138.svg?style=flat-square&logo=Swift&logoColor=white" alt="Swift" />
<img src="https://img.shields.io/badge/Kotlin-7F52FF.svg?style=flat-square&logo=Kotlin&logoColor=white" alt="Kotlin" />
<img src="https://img.shields.io/badge/Expo-000020.svg?style=flat-square&logo=Expo&logoColor=white" alt="Expo" />
</p>
<img src="https://img.shields.io/github/license/Acetyld/expo-foreground-actions?style=flat-square&color=5D6D7E" alt="GitHub license" />
<img src="https://img.shields.io/github/last-commit/Acetyld/expo-foreground-actions?style=flat-square&color=5D6D7E" alt="git-last-commit" />
<img src="https://img.shields.io/github/commit-activity/m/Acetyld/expo-foreground-actions?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/languages/top/Acetyld/expo-foreground-actions?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

---

## 📖 Table of Contents
- [📖 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [📦 Features](#-features)
- [📂 repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
   - [🔧 Installation](#-installation)
   - [🤖 How to use](#-running-expo-foreground-actions)
- [🛣 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

The main goal of this library is to provide a way to run the **ios**: *beginBackgroundTaskWithName* and **android**: *startForegroundService* methods.

My goal for this library is to do what beginBackgroundTaskWithName was made for, start a action that could still be active when the user goes to the next app, for example, sending a chat message, creating a task or even running a sync.

On IOS we get roughly 30 seconds (mostly) and on android we can run a foreground task pretty long but ofcourse it always depends on the android model and their background policy.
But from my experience, you can safely run a foreground task for 30 seconds on both platforms.
But... remember doing a location tracking in background is not the goal of this library, this is because IOS only has 30 seconds on average, there are better alternatives for this like using a WorkManager or a GTaskScheduler

If you want to use this package please look at the [Example](https://github.com/Acetyld/expo-foreground-actions/tree/main/example)

---
## 📦 Features

**IOS & Android**
- Run javascript while app went to background
- Run multiple foreground actions at the same time
- Force stop all foreground actions

**Android**
- Show a notification with a title and description and optional progress bar. Also support for linking.
- Support for new android 34+ background policy (so no actual notification is shown, but the foreground service is still running and it can be seen from the notification drawer)

**Ios**
- Be notified when the background time you get is almost over so you can save your data and stop the task.

**Web**
- Not fully supported, we suggest using runInJS for this because a error would be thrown if you try to run a foreground action on web.
---


## 📂 Repository Structure

```sh
└── expo-foreground-actions/
    ├── .eslintrc.js
    ├── android/
    ├── example/
    │   ├── App.tsx
    │   ├── android/
    │   ├── app.json
    │   ├── babel.config.js
    │   ├── metro.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── plugins/
    │   │   └── expo-foreground-actions.js
    │   ├── tsconfig.json
    │   ├── webpack.config.js
    │   └── yarn.lock
    ├── ios/
    ├── package-lock.json
    ├── package.json
    ├── plugins/
    │   └── expo-foreground-actions.js
    ├── src/
    │   ├── ExpoForegroundActions.types.ts
    │   ├── ExpoForegroundActionsModule.ts
    │   └── index.ts
    ├── tsconfig.json
    └── yarn.lock

```

## 🚀 Getting Started

***Dependencies***

Please ensure you have the following dependencies installed on your system:

`- ℹ️ Expo v49+`

`- ℹ️ Bare/Manage workflow, we do not support Expo GO`

### 🔧 Installation

1. Clone the expo-foreground-actions repository:

   **NPM**
    ```sh
    npm install expo-foreground-actions
    ```

   **Yarn**
    ```sh
    yarn add expo-foreground-actions
    ```

2. Install the plugin, for now download the repo and copy the [plugins](https://github.com/Acetyld/expo-foreground-actions/tree/main/plugins) folder to your project root.
3. Then update your app.json to include the plugin and a scheme if u wanna use the plugin with a deeplink. <br/>https://docs.expo.dev/guides/linking/
    ```sh
   "expo": {
      "scheme": "myapp",
      "plugins": [
        [
          "./plugins/expo-foreground-actions"
        ]
      ],
   }
    ```

3. Make sure the plugin is loaded in your app.json, you can do this by running **prebuild on managed** or by running **pod install/gradle build** on bare.

### 🤖 How to use?

For now there is not dedicated documentation, i showed off the current methods in the example app. See below

- See [Example](https://github.com/Acetyld/expo-foreground-actions/tree/main/example) folder on how to use this package.

#### **Methods**

| Function Name                   | Description                                            | Parameters                                                                                          | Return Type         |
|---------------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------|
| `startForegroundAction`         | Start a foreground action on Android or iOS.           | `options?: AndroidSettings`                                                                         | `Promise<number>`   |
| `runForegroundedAction`         | Run a foreground action with specified settings.       | `act: (api: ForegroundApi) => Promise<void>, androidSettings: AndroidSettings, settings?: Settings` | `Promise<void>`     |
| `updateForegroundedAction`      | Update the settings of a foreground action on Android. | `id: number, options: AndroidSettings`                                                              | `Promise<void>`     |
| `stopForegroundAction`          | Stop a foreground action with the given identifier.    | `id: number`                                                                                        | `Promise<void>`     |
| `forceStopAllForegroundActions` | Forcefully stop all foreground actions.                | None                                                                                                | `Promise<void>`     |
| `getForegroundIdentifiers`      | Get the identifiers of active foreground actions.      | None                                                                                                | `Promise<number[]>` |
| `getRanTaskCount`               | Get the count of executed tasks.                       | None                                                                                                | `number`            |
| `getBackgroundTimeRemaining`    | Get the remaining background time on iOS.              | None                                                                                                | `Promise<number>`   |
| `addExpirationListener`         | Add a listener for expiration events.                  | `listener: (event: ExpireEventPayload) => void`                                                     | `Subscription`      |

Please note that some functions have optional parameters, and the return types are asynchronous promises or specific data types.

#### **Interfaces/Errors**


| Interface Name             | Description                                                                    | Contents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ExpireEventPayload`       | An interface representing the payload of an expiration event.                  | - `remaining`: number - The remaining time before expiration. - `identifier`: number - The identifier associated with the action.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `AndroidSettings`          | An interface representing settings for Android foreground actions.             | - `headlessTaskName`: string - The name of the headless task. - `notificationTitle`: string - Title for the notification. - `notificationDesc`: string - Description for the notification. - `notificationColor`: string - Color for the notification. - `notificationIconName`: string - Name of the notification icon. - `notificationIconType`: string - Type of the notification icon. - `notificationProgress`: number - Current progress value for the notification. - `notificationMaxProgress`: number - Maximum progress value for the notification. - `notificationIndeterminate`: boolean - Whether the notification progress is indeterminate. - `linkingURI`: string - URI to link to. |
| `Settings`                 | An interface representing additional settings for foreground actions.          | - `events`: Object - Event callbacks.   - `onIdentifier`: Function - Callback function when an identifier is generated. - `runInJS`: boolean - Indicates whether to run the action in JavaScript.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `ForegroundApi`            | An interface representing the API available to the foreground action function. | - `headlessTaskName`: string - The name of the headless task. - `identifier`: number - The identifier associated with the action.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

---


## 🛣 Project Roadmap

> - [X] `ℹ️  Task 1: Initial launch`
> - [X] `ℹ️  Task 2: Possiblity to run multiple foreground tasks`

---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/Acetyld/expo-foreground-actions/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Acetyld/expo-foreground-actions/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/Acetyld/expo-foreground-actions/issues)**: Submit bugs found or log feature requests for ACETYLD.

#### *Contributing Guidelines*

<details closed>
<summary>Click to expand</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone <your-forked-repo-url>
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear and concise message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License


This project is protected under the [MIT](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## 👏 Acknowledgments

- Idea/inspiration from https://github.com/Rapsssito/react-native-background-actions

[**Return**](#Top)

---

