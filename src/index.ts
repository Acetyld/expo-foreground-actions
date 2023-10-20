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

let ranTaskCount: number = 0;
let identifier: number = 0;


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

  const headlessTaskName = `${initialOptions.headlessTaskName}${ranTaskCount}`;

  const options = { ...initialOptions, headlessTaskName };
  const action = async () => {
    if (AppState.currentState === "background") {
      throw new NotForegroundedError("Foreground actions can only be run in the foreground");
    }
    await act(initialOptions.params, {
      headlessTaskName
    });
  };

  try {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      throw new Error("Unsupported platform, currently only ios and android are supported");
    }
    ranTaskCount++;

    if (options.runInJS === true) {
      await runJS(action, options);
      return;
    }
    if (Platform.OS === "android") {
      /*On android we wrap the headless task in a promise so we can "await" the starter*/
      await runAndroid(action, options);
      return;
    }
    if (Platform.OS === "ios") {
      await runIos(action, options);
      return;
    }
    console.log("Running on unknown platform is not supported");
    return;
  } catch (e) {
    throw e;
  }
};


const runJS = async (action: () => Promise<void>, options: ExpoForegroundOptions) => {
  console.log("Running on JS");
  await action();
  identifier = 0;
};

const runIos = async (action: () => Promise<void>, options: ExpoForegroundOptions) => {
  console.log("Running on IOS");
  await startForegroundAction();
  try{
    await action();
  } catch (e){
    throw e;
  } finally {
    await stopForegroundAction();
  }
};

const runAndroid = async (action: () => Promise<void>, options: ExpoForegroundOptions) => new Promise<void>(async (resolve, reject) => {
  console.log("Running on Android");
  try {
    /*First we register the headless task so we can run it from the Foreground service*/
    AppRegistry.registerHeadlessTask(options.headlessTaskName, () => async () => {
      /*Then we start the actuall foreground action, we all do this in the headless task, without touching UI, we can still update UI be using something like Realm for example*/
      try {
        await action();
        await stopForegroundAction();
        resolve();
      } catch (e) {
        /*We do this to make sure its ALWAYS stopped*/
        await stopForegroundAction();
        throw e;
      }
    });
    await startForegroundAction(options);

  } catch (e) {
    reject(e);
    throw e;
  }
});

export const updateForegroundedAction = async (options: ExpoForegroundOptions) => {
  if (Platform.OS !== "android") return;
  return ExpoForegroundActionsModule.updateForegroundedAction(options);
};

// noinspection JSUnusedGlobalSymbols
export const stopForegroundAction = async (): Promise<void> => {
  await ExpoForegroundActionsModule.stopForegroundAction(false);
};

// noinspection JSUnusedGlobalSymbols

export const forceStopForegroundAction = async (): Promise<void> => {
  await ExpoForegroundActionsModule.stopForegroundAction(true);
};

// noinspection JSUnusedGlobalSymbols
export const getForegroundIdentifier = async (): Promise<number> => ExpoForegroundActionsModule.getForegroundIdentifier();
// noinspection JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols
export const getRanTaskCount = () => ranTaskCount;


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
