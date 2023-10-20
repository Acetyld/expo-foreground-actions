import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
  Platform
} from "expo-modules-core";
import { platformApiLevel } from "expo-device";
import {
  ExpireEventPayload,
  ExpoForegroundOptions,
  ForegroundApi
} from "./ExpoForegroundActions.types";
import ExpoForegroundActionsModule from "./ExpoForegroundActionsModule";
import { AppRegistry, AppState } from "react-native";

const emitter = new EventEmitter(
  ExpoForegroundActionsModule ?? NativeModulesProxy.ExpoForegroundActions
);

let runningTasks: number = 0;
let _isRunning = false;
let identifier: number = 0;


const setRunning = (val: boolean) => {
  if (val) {
    _isRunning = true;
    runningTasks++;
  } else {
    _isRunning = false;
  }
};

export class NotForegroundedError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "NotForegroundedError"; // (2)
  }
}


export class ForegroundAlreadyRunningError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "NotForegroundedError"; // (2)
  }
}

const startForegroundAction = async (options?: ExpoForegroundOptions): Promise<number> => {
  if (Platform.OS === "android" && !options) {
    throw new Error("Foreground action options cannot be null on android");
  }
  if (Platform.OS === "android") {
    return ExpoForegroundActionsModule.startForegroundAction(options);
  } else {
    return ExpoForegroundActionsModule.startForegroundAction();
  }
};


// Get the native constant value.
export const runForegroundedAction = async <Params>(act: (params: Params, api: ForegroundApi) => Promise<void>, initialOptions: ExpoForegroundOptions & {
  params: Params
}): Promise<void> => {
  if (!initialOptions) {
    throw new Error("Foreground action options cannot be null");
  }

  if (AppState.currentState === "background") {
    throw new NotForegroundedError("Foreground actions can only be run in the foreground");
  }

  if (Platform.OS === "android" && platformApiLevel && platformApiLevel < 26) {
    initialOptions.runInJS = true;
  }

  if (initialOptions.runInJS !== true) {
    identifier = await ExpoForegroundActionsModule.getForegroundIdentifier();
  }
  if (identifier) {
    throw new ForegroundAlreadyRunningError("Foreground action is already running, wait or stopp it first");
  }

  const headlessTaskName = `${initialOptions.headlessTaskName}${runningTasks}`;

  const options = { ...initialOptions, headlessTaskName };
  const action = async () => {
    if (AppState.currentState === "background") {
      throw new NotForegroundedError("Foreground actions can only be run in the foreground");
    }
    await act(initialOptions.params, {
      headlessTaskName
    });
  };

  setRunning(true);
  try {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      throw new Error("Unsupported platform, currently only ios and android are supported");
    }

    if (options.runInJS !== true) {
      if (Platform.OS === "android") {
        console.log("Running on Android");
        /*On android we wrap the headless task in a promise so we can "await" the starter*/
        await (new Promise<void>(async (resolve, reject) => {
          try {
            /*First we register the headless task so we can run it from the Foreground service*/
            AppRegistry.registerHeadlessTask(options.headlessTaskName, () => async () => {
              await action();
              resolve();
            });
            /*Then we start the actuall foreground action*/
            await startForegroundAction(options);
          } catch (e) {
            reject(e);
            throw e;
          }
        }));
        return;
      }
      if (Platform.OS === "ios") {
        console.log("Running on IOS");
        await startForegroundAction();
        await action();
        return;
      }
      console.log("Running on unknown platform is not supported");
      return;
    }

    identifier++;
    console.log("Running in JS");
    await action();

  } finally {
    if (options.runInJS !== true) {
      await ExpoForegroundActionsModule.stopForegroundAction();
    } else {
      identifier = 0;
    }
    setRunning(false);
  }
};

export const updateForegroundedAction = async (options: ExpoForegroundOptions) => {
  if (Platform.OS !== "android") return;
  return ExpoForegroundActionsModule.updateForegroundedAction(options);
};

// noinspection JSUnusedGlobalSymbols

export const stopForegroundAction = async (): Promise<void> => {
  await ExpoForegroundActionsModule.stopForegroundAction();
  setRunning(false);
};

// noinspection JSUnusedGlobalSymbols
export const getForegroundIdentifier = async (): Promise<number> => ExpoForegroundActionsModule.getForegroundIdentifier();
// noinspection JSUnusedGlobalSymbols
export const isRunning = () => _isRunning;
// noinspection JSUnusedGlobalSymbols
export const getRunningTasks = () => runningTasks;


export const getBackgroundTimeRemaining = async (): Promise<number> => {
  if (Platform.OS !== "ios") return -1;
  return await ExpoForegroundActionsModule.getBackgroundTimeRemaining();
};


export function addExpirationListener(
  listener: (event: ExpireEventPayload) => void
): Subscription {
  return emitter.addListener("onExpirationEvent", listener);
}

export { ExpireEventPayload };
