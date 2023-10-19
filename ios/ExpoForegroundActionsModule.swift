import ExpoModulesCore
let ON_EXPIRATION_EVENT = "onExpirationEvent"

public class ExpoForegroundActionsModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        Events(ON_EXPIRATION_EVENT)

        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoForegroundActions')` in JavaScript.
        Name("ExpoForegroundActions")

        AsyncFunction("startForegroundAction") { (promise: Promise) in
            var identifier: UIBackgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid // Declare the identifier variable here
            print("Executing...")

            identifier = UIApplication.shared.beginBackgroundTask {
                // Expiration block, perform cleanup including endBackgroundTask
                print("Expiring...")
                self.onExpiration(amount: UIApplication.shared.backgroundTimeRemaining);
                UIApplication.shared.endBackgroundTask(identifier)
            }

            print("Resolving...")

            promise.resolve(identifier.rawValue)
        }
        AsyncFunction("stopForegroundAction") { (identifier: Int, promise: Promise) in
            let backgroundTaskIdentifier = UIBackgroundTaskIdentifier(rawValue: identifier)
            if backgroundTaskIdentifier != UIBackgroundTaskIdentifier.invalid {
                UIApplication.shared.endBackgroundTask(backgroundTaskIdentifier)
            } else {
                print("Background task with identifier \(identifier) does not exist or has already been ended.")
            }
            promise.resolve()
        }

        AsyncFunction("getBackgroundTimeRemaining") { (promise: Promise) in
            promise.resolve(UIApplication.shared.backgroundTimeRemaining)
        }

    }

    @objc
    private func onExpiration(amount:Double) {
        sendEvent(ON_EXPIRATION_EVENT, [
            "remaining": amount
        ])
    }
}
