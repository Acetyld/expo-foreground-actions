import ExpoModulesCore
let ON_EXPIRATION_EVENT = "onExpirationEvent"

public class ExpoForegroundActionsModule: Module {
    var backgroundTaskIdentifiers: [UIBackgroundTaskIdentifier] = []
    
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
            
            var backgroundTaskIdentifier: UIBackgroundTaskIdentifier = .invalid
            
            backgroundTaskIdentifier = UIApplication.shared.beginBackgroundTask {
                // Expiration block, perform cleanup including endBackgroundTask
                self.onExpiration(amount: UIApplication.shared.backgroundTimeRemaining, identifier:backgroundTaskIdentifier);
                UIApplication.shared.endBackgroundTask(backgroundTaskIdentifier)
            }
            backgroundTaskIdentifiers.append(backgroundTaskIdentifier)
            print(backgroundTaskIdentifier.rawValue);
            promise.resolve(backgroundTaskIdentifier.rawValue)
            
        }
        AsyncFunction("stopForegroundAction") { (taskIdentifier: Int, promise: Promise) in
            let backgroundTaskID = UIBackgroundTaskIdentifier.init(rawValue: taskIdentifier);
            
            if backgroundTaskID == .invalid {
                print("Background task with identifier \(taskIdentifier) does not exist or has already been ended")
                promise.resolve()
                return
            }
            
            if let index = backgroundTaskIdentifiers.firstIndex(where: {$0.rawValue == taskIdentifier}) {
                backgroundTaskIdentifiers.remove(at: index)
            }
            UIApplication.shared.endBackgroundTask(backgroundTaskID)
            
            promise.resolve()
        }
        
        AsyncFunction("forceStopAllForegroundActions") { (promise: Promise) in
            for identifier in backgroundTaskIdentifiers {
                print("Stopping identifier:",identifier.rawValue)
                UIApplication.shared.endBackgroundTask(identifier)
            }
            backgroundTaskIdentifiers.removeAll()
            promise.resolve()
        }
        
        
        AsyncFunction("getBackgroundTimeRemaining") { (promise: Promise) in
            promise.resolve(UIApplication.shared.backgroundTimeRemaining)
        }
        
        AsyncFunction("getForegroundIdentifiers") { (promise: Promise) in
            let identifierValues = backgroundTaskIdentifiers.map { $0.rawValue }
            promise.resolve(identifierValues)
        }
        
    }
    
    @objc
    private func onExpiration(amount:Double,identifier:UIBackgroundTaskIdentifier) {
        sendEvent(ON_EXPIRATION_EVENT, [
            "remaining": amount,
            "identifier": identifier.rawValue
        ])
    }
}
