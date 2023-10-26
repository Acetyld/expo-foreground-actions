import {
  addExpirationListener, forceStopAllForegroundActions,
  getBackgroundTimeRemaining,
  getForegroundIdentifiers,
  runForegroundedAction,
  stopForegroundAction,
  updateForegroundedAction
} from "expo-foreground-actions";
import { useEffect, useRef } from "react";
import {
  AppState,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { ForegroundAction, ForegroundApi } from "expo-foreground-actions/ExpoForegroundActions.types";

const FunciTestFunction = async ({
                                   headlessTaskName,
                                   identifier
                                 }: ForegroundApi) => {
  let time = Date.now();
  let duration = 0;
  while (duration < 10) {
    console.log("Logging every 1 second... from foreground!", time);
    await wait(1000); // Wait for 1 second
    duration += 1;
    // await updateForegroundedAction(identifier, {
    //   headlessTaskName: headlessTaskName,
    //   notificationTitle: "Notification Title",
    //   notificationDesc: "Notification Description",
    //   notificationColor: "#FFC107",
    //   notificationIconName: "ic_launcher",
    //   notificationIconType: "mipmap",
    //   notificationProgress: duration * 10,
    //   notificationMaxProgress: 100,
    //   notificationIndeterminate: false
    // });

    if (Platform.OS === "ios") {
      await getBackgroundTimeRemaining().then((r) => {
        console.log("Remaining time:", r);
      });
    }
  }
  console.log("Logging interval ended.");
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FunciInterface {
  test: string;
}


export default function App() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentRunningId = useRef<null | number>(null);
  useEffect(() => {
    const sub = addExpirationListener((event) => {
      console.log(event.remaining);
      /*Here we should put the task back to pending, because we need to create a new foreground actions to get new background time*/
    });

    return () => {
      sub && sub.remove();
    };
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("Logging every 1 second, so we can see when the app gets \"paused\"");
    }, 1000);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" />
      <Button title={"Get identifiers"} onPress={() => {
        getForegroundIdentifiers().then(r => console.log(r));
      }} />
      <Button
        title="startForegroundAction"
        onPress={async () => {
          try {


            console.log("BEFORE runForegroundedAction");

            await runForegroundedAction(async (api) => {
              await FunciTestFunction(api);
            }, {
              headlessTaskName: "create_task",
              notificationTitle: "Notification Title",
              notificationDesc: "Notification Description",
              notificationColor: "#FFC107",
              notificationIconName: "ic_launcher",
              notificationIconType: "mipmap",
              notificationProgress: 1,
              notificationMaxProgress: 100,
              notificationIndeterminate: false,
              linkingURI: "myapp://"
            }, {
              events: {
                onIdentifier: (id) => {
                  if (!currentRunningId.current) currentRunningId.current = id;
                  console.log("Identifier:", id);
                }
              }
            });

            console.log("AFTER runForegroundedAction");

          } catch (e) {
            console.log(e);
          }
        }}
      />
      <Button title={"stopForegroundAction"} onPress={async () => {
        if (currentRunningId.current) {
          console.log("Stopping foreground action with id:", currentRunningId.current);
          await stopForegroundAction(currentRunningId.current);
          currentRunningId.current = null;
          console.log("Stopped foreground action");
        } else {
          console.log("No running foreground action");
        }
      }} />
      <Button title={"forceStopAllForegroundActions"} onPress={async () => {
        await forceStopAllForegroundActions();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center"
  }
});
