import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
  Platform
} from "expo-modules-core";
import { platformApiLevel } from "expo-device";
import { ExpireEventPayload, ExpoForegroundOptions, ForegroundApi } from "./ExpoForegroundActions.types";
import ExpoForegroundActionsModule from "./ExpoForegroundActionsModule";
import { AppRegistry } from "react-native";

const emitter = new EventEmitter(
  ExpoForegroundActionsModule ?? NativeModulesProxy.ExpoForegroundActions
);

let identifier: number = 0;
let runningTasks: number = 0;
let _isRunning = false;

export const isRunning = () => _isRunning;

const setRunning = (val: boolean) => {
  if (val) {
    _isRunning = true;
    runningTasks++;
  } else {
    _isRunning = false;
  }
};


// Get the native constant value.
export async function runForegroundedAction<Params>(act: (params: Params, api: ForegroundApi) => Promise<void>, initialOptions: ExpoForegroundOptions & {
  params: Params
}): Promise<void> {
  if (Platform.OS === "ios" && identifier) {
    throw new Error("Foreground action is already running");
  }
  if (!initialOptions) {
    throw new Error("Foreground action options cannot be null");
  }
  const createAction = (resolve: () => void, options: ExpoForegroundOptions) => {
    const headlessTaskName = `${options.headlessTaskName}${runningTasks}`;
    return {
      action: async (iosIdentifier?: number) => {


        await act(initialOptions.params, {
          iosIdentifier,
          headlessTaskName
        });

        if (iosIdentifier) {
          await ExpoForegroundActionsModule.stopForegroundAction(iosIdentifier);
        } else {
          await ExpoForegroundActionsModule.stopForegroundAction();
        }
        resolve();
      },
      options: { ...options, headlessTaskName }
    };
  };


  await new Promise<void>(async (resolve, reject) => {
    const { action, options } = createAction(resolve, initialOptions);
    try {
      if (options.runInJS !== true) {
        if (Platform.OS === "android" && (!platformApiLevel || platformApiLevel >= 26)) {
          /*On older devices we "just" run it.*/
          setRunning(true);
          AppRegistry.registerHeadlessTask(options.headlessTaskName, () => async () => await action());
          await ExpoForegroundActionsModule.startForegroundAction(options);
          return;
        }
        if (Platform.OS === "ios") {
          setRunning(true);
          const iosIdentifier = await ExpoForegroundActionsModule.startForegroundAction();
          await action(iosIdentifier);
          identifier = 0;
          return;
        }
        console.error("Unsupported platform");
        return;
      }
      setRunning(true);
      await action();

    } catch (e) {
      setRunning(false);
      reject(e);
    }
  });
  setRunning(false);
}

export async function updateForegroundedAction(options: ExpoForegroundOptions) {
  if (Platform.OS !== "android") return;
  return ExpoForegroundActionsModule.updateForegroundedAction(options);
}


export async function getBackgroundTimeRemaining(): Promise<number> {
  if (Platform.OS !== "ios") return 0;
  return await ExpoForegroundActionsModule.getBackgroundTimeRemaining();
}


export function addExpirationListener(
  listener: (event: ExpireEventPayload) => void
): Subscription {
  return emitter.addListener("onExpirationEvent", listener);
}

export { ExpireEventPayload };
