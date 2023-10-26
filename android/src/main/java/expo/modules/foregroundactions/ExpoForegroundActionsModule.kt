package expo.modules.foregroundactions

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.toCodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition


const val ON_EXPIRATION_EVENT = "onExpirationEvent"

class ExpoForegroundActionsModule : Module() {
    private val intentMap: MutableMap<Int, Intent> = mutableMapOf()
    private var currentReferenceId: Int = 0


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
                val intent = Intent(context, ExpoForegroundActionsService::class.java)
                intent.putExtra("headlessTaskName", options.headlessTaskName)
                intent.putExtra("notificationTitle", options.notificationTitle)
                intent.putExtra("notificationDesc", options.notificationDesc)
                intent.putExtra("notificationColor", options.notificationColor)
                val notificationIconInt: Int = context.resources.getIdentifier(options.notificationIconName, options.notificationIconType, context.packageName)
                intent.putExtra("notificationIconInt", notificationIconInt)
                intent.putExtra("notificationProgress", options.notificationProgress)
                intent.putExtra("notificationMaxProgress", options.notificationMaxProgress)
                intent.putExtra("notificationIndeterminate", options.notificationIndeterminate)
                intent.putExtra("linkingURI", options.linkingURI)
                currentReferenceId++

                intentMap[currentReferenceId] = intent
                intent.putExtra("notificationId", currentReferenceId)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(intent)
                } else {
                    context.startService(intent)
                }
                promise.resolve(currentReferenceId)

            } catch (e: Exception) {
                println(e.message);

                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
        }

        AsyncFunction("stopForegroundAction") { identifier: Int, promise: Promise ->
            try {
                println(identifier);
                println(intentMap);
                val intent = intentMap[identifier]
                if (intent !== null) {
                    context.stopService(intent)
                    intentMap.remove(identifier)
                } else {
                    println("Background task with identifier $identifier does not exist or has already been ended");

                }
            } catch (e: Exception) {
                println(e.message);
                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
            promise.resolve(null)
        }

        AsyncFunction("updateForegroundedAction") { identifier: Int, options: ExpoForegroundOptions, promise: Promise ->
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
                        options.notificationIndeterminate,
                        options.linkingURI,
                );
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.notify(identifier, notification)
                promise.resolve(null)
            } catch (e: Exception) {
                println(e.message);
                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
        }

        AsyncFunction("forceStopAllForegroundActions") { promise: Promise ->
            try {
                if (intentMap.isEmpty()) {
                    println("No intents to stop.")
                } else {
                    for ((_, intent) in intentMap) {
                        context.stopService(intent)
                    }
                    intentMap.clear()
                }
                promise.resolve(null)
            } catch (e: Exception) {
                println(e.message)
                // Handle other exceptions
                promise.reject(e.toCodedException())
            }
        }
        AsyncFunction("getForegroundIdentifiers") { promise: Promise ->
            val identifiers = intentMap.keys.toTypedArray()
            promise.resolve(identifiers)
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
