import {
  addExpirationListener,
  getBackgroundTimeRemaining, runForegroundedAction, updateForegroundedAction
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
import { ForegroundAction } from "expo-foreground-actions/ExpoForegroundActions.types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FunciInterface {
  test: string;
}


export default function App() {
  const lastEventId = useRef<null | number>(null);
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
    setInterval(() => {
      console.log("Logging every 1 second, so we can see when the app gets \"paused\"");
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" />
      <Button
        title="startForegroundAction"
        onPress={async () => {
          try {

            const FunciTestFunction: ForegroundAction<FunciInterface> = async ({ test }, {
              headlessTaskName
            }) => {
              console.log("[AppState.currentState]: ", AppState.currentState);
              console.log(test);
              let time = Date.now();
              let duration = 0;
              while (duration < 10) {
                console.log("Logging every 1 second... from foreground!", time);
                await wait(1000); // Wait for 1 second
                duration += 1;
                await updateForegroundedAction({
                  headlessTaskName: headlessTaskName,
                  notificationTitle: "Notification Title",
                  notificationDesc: "Notification Description",
                  notificationColor: "#FFC107",
                  notificationIconName: "ic_launcher",
                  notificationIconType: "mipmap",
                  notificationProgress: duration * 10,
                  notificationMaxProgress: 100,
                  notificationIndeterminate: false
                });

                if (Platform.OS === "ios") {
                  await getBackgroundTimeRemaining().then((r) => {
                    console.log("Remaining time:", r);
                  });
                }
              }
              console.log("Logging interval ended.");
            };

            console.log("BEFORE runForegroundedAction");

            await runForegroundedAction<FunciInterface>(FunciTestFunction, {
              headlessTaskName: "create_task",
              runInJS: false,
              notificationTitle: "Notification Title",
              notificationDesc: "Notification Description",
              notificationColor: "#FFC107",
              notificationIconName: "ic_launcher",
              notificationIconType: "mipmap",
              notificationProgress: 0,
              notificationMaxProgress: 100,
              notificationIndeterminate: true,
              params: {
                test: "test123"
              }
            });

            console.log("AFTER runForegroundedAction");

          } catch (e) {
            console.log(e);
          }
        }}
      />
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
