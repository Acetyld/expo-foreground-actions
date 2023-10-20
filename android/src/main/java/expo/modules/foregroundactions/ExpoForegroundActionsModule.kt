package expo.modules.foregroundactions

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.toCodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition


const val ON_EXPIRATION_EVENT = "onExpirationEvent"

class ExpoForegroundActionsModule : Module() {
    private var currentServiceIntent: Intent? = null
    private var currentId: Int = 0


    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    @SuppressLint("DiscouragedApi")
    override fun definition() = ModuleDefinition {
        Events(ON_EXPIRATION_EVENT)

        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoForegroundActions')` in JavaScript.
        Name("ExpoForegroundActions")


        AsyncFunction("startForegroundAction") { options: ExpoForegroundOptions, promise: Promise ->
            try {
                if (currentServiceIntent != null) {
                    promise.reject(CodedException("There is still a unstopped service running"))
                } else {                // Stop any other intent
                    // Create the service
                    val intent = Intent(context, ExpoForegroundActionsService::class.java)
                    intent.putExtra("headlessTaskName", options.headlessTaskName)
                    intent.putExtra("notificationTitle", options.notificationTitle)
                    intent.putExtra("notificationDesc", options.notificationDesc)
                    intent.putExtra("notificationColor", options.notificationColor)
                    val notificationIconInt: Int = context.resources.getIdentifier(options.notificationIconName, options.notificationIconType, context.packageName)
                    intent.putExtra("notificationIconInt", notificationIconInt)

                    /*Save as reference so we can stop it next time*/
                    currentServiceIntent = intent;
                    currentId = currentId.plus(1);

                    context.startService(currentServiceIntent)

                    promise.resolve(currentId)
                }
            } catch (e: Exception) {
                println(e.message);

                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
        }

        AsyncFunction("stopForegroundAction") { force: Boolean, promise: Promise ->
            try {
                if (currentServiceIntent != null) {
                    context.stopService(currentServiceIntent)
                    currentServiceIntent = null;
                    currentId = 0;
                } else {
                    println("Intent task does not exist or has already been ended.")
                }
            } catch (e: Exception) {
                println(e.message);
                currentServiceIntent = null;
                currentId = 0;
                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
            if (force) {
                currentId = 0;
            }
            promise.resolve(null)
        }

        AsyncFunction("updateForegroundedAction") { options: ExpoForegroundOptions, promise: Promise ->
            try {
                val notificationIconInt: Int = context.resources.getIdentifier(options.notificationIconName, options.notificationIconType, context.packageName)
                val notification: Notification = ExpoForegroundActionsService.buildNotification(
                        context,
                        options.notificationTitle,
                        options.notificationDesc,
                        Color.parseColor(options.notificationColor),
                        notificationIconInt,
                        options.notificationProgress,
                        options.notificationMaxProgress,
                        options.notificationIndeterminate
                );
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.notify(ExpoForegroundActionsService.SERVICE_NOTIFICATION_ID, notification)
                promise.resolve(null)
            } catch (e: Exception) {
                println(e.message);
                currentServiceIntent = null;
                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
        }
        AsyncFunction("getForegroundIdentifier") { promise: Promise ->
            promise.resolve(currentId)
        }
    }

    private val context
        get() = requireNotNull(appContext.reactContext) {
            "React Application Context is null"
        }

    private val applicationContext
        get() = requireNotNull(this.context.applicationContext) {
            "React Application Context is null"
        }
}
