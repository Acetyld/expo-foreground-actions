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
  ForegroundApi,
} from "./ExpoForegroundActions.types";
import ExpoForegroundActionsModule from "./ExpoForegroundActionsModule";
import { AppRegistry, AppState } from "react-native";

const emitter = new EventEmitter(
  ExpoForegroundActionsModule ?? NativeModulesProxy.ExpoForegroundActions
);

let identifier: number = 0;
let runningTasks: number = 0;
let _isRunning = false;


const setRunning = (val: boolean) => {
  if (val) {
    _isRunning = true;
    runningTasks++;
  } else {
    _isRunning = false;
    identifier = 0;
  }
};

export class NotForegroundedError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "NotForegroundedError"; // (2)
  }
}


// Get the native constant value.
export async function runForegroundedAction<Params>(act: (params: Params, api: ForegroundApi) => Promise<void>, initialOptions: ExpoForegroundOptions & {
  params: Params
}): Promise<void> {
  if (!initialOptions) {
    throw new Error("Foreground action options cannot be null");
  }
  if (identifier) {
    throw new Error("Foreground action is already running");
  }

  if (AppState.currentState === "background") {
    throw new NotForegroundedError("Foreground actions can only be run in the foreground");
  }


  const headlessTaskName = `${initialOptions.headlessTaskName}${runningTasks}`;

  const options = { ...initialOptions, headlessTaskName };
  const action = async (identifier: number) => {
    if (AppState.currentState === "background") {
      throw new NotForegroundedError("Foreground actions can only be run in the foreground");
    }
    await act(initialOptions.params, {
      identifier,
      headlessTaskName
    });
  };

  try {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      throw new Error("Unsupported platform, currently only ios and android are supported");
    }

    if (options.runInJS !== true) {
      if (Platform.OS === "android" && (!platformApiLevel || platformApiLevel >= 26)) {
        /*On older devices we "just" run it.*/
        setRunning(true);
        await (new Promise<void>(async (resolve, reject) => {
          try {
            AppRegistry.registerHeadlessTask(options.headlessTaskName, () => async () => {
              await action(identifier);
              resolve();
            });
            identifier = await ExpoForegroundActionsModule.startForegroundAction(options);
          } catch (e) {
            reject(e);
            throw e;
          }
        }));
        return;
      }
      if (Platform.OS === "ios") {
        setRunning(true);
        identifier = await ExpoForegroundActionsModule.startForegroundAction();
        console.log("Started foreground action with identifier:", identifier);
        await action(identifier);
        return;
      }
    } else {
      console.log("Running in JS")
      setRunning(true);
      await action(identifier);
    }
  } finally {
    console.log("Finally, we have the indifier:", identifier);
    await ExpoForegroundActionsModule.stopForegroundAction(identifier);
    setRunning(false);
  }
}

export async function updateForegroundedAction(options: ExpoForegroundOptions) {
  if (Platform.OS !== "android") return;
  return ExpoForegroundActionsModule.updateForegroundedAction(options);
}

export async function forceStopForegroundedAction() {
  await ExpoForegroundActionsModule.stopForegroundAction(identifier);
}

export const getCurrentIosIdentifier = () => identifier;

export const isRunning = () => _isRunning;


export async function getBackgroundTimeRemaining(): Promise<number> {
  if (Platform.OS !== "ios") return -1;
  return await ExpoForegroundActionsModule.getBackgroundTimeRemaining();
}


export function addExpirationListener(
  listener: (event: ExpireEventPayload) => void
): Subscription {
  return emitter.addListener("onExpirationEvent", listener);
}

export { ExpireEventPayload };
