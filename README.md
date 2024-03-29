<div align="center">
<h1 align="center">
<img src="https://github.com/Acetyld/expo-foreground-actions/blob/main/assets/logo.png" width="100" />
<br>EXPO-FOREGROUND-ACTIONS</h1>
<div style="font-style: italic">Running Foreground actions for Android/IOS</div>
<div style="opacity: 0.5;margin-top:10px;">Developed with the software and tools below.</div>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/React Native-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Swift-F05138.svg?style=flat-square&logo=Swift&logoColor=white" alt="Swift" />
<img src="https://img.shields.io/badge/Kotlin-7F52FF.svg?style=flat-square&logo=Kotlin&logoColor=white" alt="Kotlin" />
<img src="https://img.shields.io/badge/Expo-000020.svg?style=flat-square&logo=Expo&logoColor=white" alt="Expo" />

</p>
<a href="https://www.npmjs.com/package/expo-foreground-actions">
  <img src="https://img.shields.io/npm/v/expo-foreground-actions?style=flat-square" alt="npm version">
</a>
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
    - [🤖 How to use](#-how-to-use)
    - [🤖 Functions](#-functions)
    - [🤖 Interfaces](#-interfaces)
- [🛣 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

Start actions that continue to run in the grace period after the user switches apps. This library facilitates the
execution of **ios**'s `beginBackgroundTaskWithName` and **android**'s `startForegroundService` methods. The primary
objective is to emulate the behavior of `beginBackgroundTaskWithName`, allowing actions to persist even when the user
switches to another app. Examples include sending chat messages, creating tasks, or running synchronizations.

On iOS, the grace period typically lasts around 30 seconds, while on Android, foreground tasks can run for a longer
duration, subject to device models and background policies. In general, a foreground task can safely run for about 30
seconds on both platforms. However, it's important to note that this library is not intended for background location
tracking. iOS's limited 30-second window makes it impractical for such purposes. For background location tracking,
alternatives like WorkManager or GTaskScheduler are more suitable.

For usage instructions, please refer to
the [Example](https://github.com/Acetyld/expo-foreground-actions/tree/main/example) provided.

---

## 📦 Features

### For IOS & Android:

- Execute JavaScript while the app is in the background.
- Run multiple foreground actions simultaneously.
- Forcefully terminate all foreground actions.

### For Android:

- Display notifications with customizable titles, descriptions, and optional progress bars, along with support for deep
  linking.
- Comply with the latest Android 34+ background policy, ensuring that foreground services continue to run without
  displaying a visible notification. Users can still access these services from the notification drawer.

### For IOS:

- Receive notifications when the background execution time is about to expire. This feature allows users to save their
  data and terminate tasks gracefully.

### Web Support:

- Limited support for web platforms. We recommend using the `runInJS` method due to potential errors when attempting to
  run foreground actions on web browsers.

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

2. Install the plugin, for now download the repo and copy
   the [plugins](https://github.com/Acetyld/expo-foreground-actions/tree/main/plugins) folder to your project root.
3. Then update your app.json to include the plugin and a scheme if u wanna use the plugin with a
   deeplink. <br/>https://docs.expo.dev/guides/linking/
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

3. Make sure the plugin is loaded in your app.json, you can do this by running **prebuild on managed** or by running *
   *pod install/gradle build** on bare.

### 🤖 How to use?

For the time being, dedicated documentation is not available. However, you can explore the usage of current methods in
the provided example app. Refer to the [Example](https://github.com/Acetyld/expo-foreground-actions/tree/main/example)
folder to understand how to utilize this package effectively.

![Example](assets/App_tsx.png)

### 🤖 Functions

#### `runForegroundedAction`

```typescript
export const runForegroundedAction = async (
  act: (api: ForegroundApi) => Promise<void>,
  androidSettings: AndroidSettings,
  settings: Settings = { runInJS: false }
): Promise<void>;
```

- `act`: The foreground action function to be executed.
- `androidSettings`: Android-specific settings for the foreground action.
- `settings`: Additional settings for the foreground action.

#### `startForegroundAction`

```typescript
export const startForegroundAction = async (
  options?: AndroidSettings
): Promise<number>;
```

- `options`: Android-specific settings for the foreground action.

#### `stopForegroundAction`

```typescript
export const stopForegroundAction = async (id: number): Promise<void>;
```

- `id`: The unique identifier of the foreground action to stop.

#### `updateForegroundedAction`

```typescript
export const updateForegroundedAction = async (
  id: number,
  options: AndroidSettings
): Promise<void>;
```

- `id`: The unique identifier of the foreground action to update.
- `options`: Updated Android-specific settings for the foreground action.

#### `forceStopAllForegroundActions`

```typescript
export const forceStopAllForegroundActions = async (): Promise<void>;
```

- Forcefully stops all running foreground actions.

#### `getForegroundIdentifiers`

```typescript
export const getForegroundIdentifiers = async (): Promise<number>;
```

- Retrieves the identifiers of all currently running foreground actions.

#### `getRanTaskCount`

```typescript
export const getRanTaskCount = () => ranTaskCount;
```

- Retrieves the count of tasks that have run.

#### `getBackgroundTimeRemaining`

```typescript
export const getBackgroundTimeRemaining = async (): Promise<number>;
```

- Retrieves the remaining background execution time on iOS.

### 🤖 Interfaces

#### `ExpireEventPayload`

```typescript
export type ExpireEventPayload = {
  remaining: number;
  identifier: number;
};
```

- `remaining`: The remaining time in seconds before the foreground action expires.
- `identifier`: The unique identifier of the foreground action.

#### `AndroidSettings`

```typescript
export interface AndroidSettings {
  headlessTaskName: string;
  notificationTitle: string;
  notificationDesc: string;
  notificationColor: string;
  notificationIconName: string;
  notificationIconType: string;
  notificationProgress: number;
  notificationMaxProgress: number;
  notificationIndeterminate: boolean;
  linkingURI: string;
}
```

- `headlessTaskName`: Name of the headless task associated with the foreground action.
- `notificationTitle`: Title of the notification shown during the foreground action.
- `notificationDesc`: Description of the notification.
- `notificationColor`: Color of the notification.
- `notificationIconName`: Name of the notification icon.
- `notificationIconType`: Type of the notification icon.
- `notificationProgress`: Current progress value for the notification.
- `notificationMaxProgress`: Maximum progress value for the notification.
- `notificationIndeterminate`: Indicates if the notification progress is indeterminate.
- `linkingURI`: URI to link to when the notification is pressed.

#### `Settings`

```typescript
export interface Settings {
  events?: {
    onIdentifier?: (identifier: number) => void;
  }
  runInJS?: boolean,
}
```

- `events`: Event handlers for foreground actions.
    - `onIdentifier`: A callback function called when an identifier is generated.
- `runInJS`: Indicates whether to run the foreground action without using a headless task or ios background task.

---

## 🛣 Project Roadmap

> - [X] `ℹ️ Task 1: Initial launch`
> - [X] `ℹ️ Task 2: Possiblity to run multiple foreground tasks`
> - [ ] `ℹ️ Any idea's are welcome =)`

---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/Acetyld/expo-foreground-actions/blob/main/CONTRIBUTING.md)**: Review open
  PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Acetyld/expo-foreground-actions/discussions)**: Share your insights,
  provide feedback, or ask questions.
- **[Report Issues](https://github.com/Acetyld/expo-foreground-actions/issues)**: Submit bugs found or log feature
  requests for ACETYLD.

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
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and
   their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License

This project is protected under the [MIT](https://choosealicense.com/licenses) License. For more details, refer to
the [LICENSE](https://choosealicense.com/licenses/) file.

---

## 👏 Acknowledgments

- Idea/inspiration from https://github.com/Rapsssito/react-native-background-actions
- [Expo](https://expo.dev) for providing a platform to build universal apps using React Native.
- [Benedikt](https://twitter.com/bndkt) for mentioning this package in the "thisweekinreact"
  newsletter: [Week 176](https://thisweekinreact.com/newsletter/176)

[**Return**](#Top)

---

