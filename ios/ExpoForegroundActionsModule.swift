import ExpoModulesCore
let ON_EXPIRATION_EVENT = "onExpirationEvent"

public class ExpoForegroundActionsModule: Module {
    var identifier: UIBackgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid
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
    
    
            print("Executing...")
            
            self.identifier = UIApplication.shared.beginBackgroundTask {
                // Expiration block, perform cleanup including endBackgroundTask
                print("Expiring...")
                self.onExpiration(amount: UIApplication.shared.backgroundTimeRemaining);
                UIApplication.shared.endBackgroundTask(self.identifier)
            }
            
            print("Resolving...")
            
            promise.resolve(self.identifier.rawValue)
        }
        AsyncFunction("stopForegroundAction") { (force:Bool, promise: Promise) in
            if self.identifier != UIBackgroundTaskIdentifier.invalid {
                UIApplication.shared.endBackgroundTask(self.identifier)
                self.identifier = UIBackgroundTaskIdentifier.invalid;
            } else {
                print("Background task with identifier \(self.identifier) does not exist or has already been ended.")
            }
            if(force){
                self.identifier = UIBackgroundTaskIdentifier.invalid;
            }
            promise.resolve()
        }
        
        AsyncFunction("getBackgroundTimeRemaining") { (promise: Promise) in
            promise.resolve(UIApplication.shared.backgroundTimeRemaining)
        }
        
        AsyncFunction("getForegroundIdentifier") { (promise: Promise) in
            promise.resolve(self.identifier.rawValue)
        }
        
    }
    
    @objc
    private func onExpiration(amount:Double) {
        sendEvent(ON_EXPIRATION_EVENT, [
            "remaining": amount
        ])
    }
}
