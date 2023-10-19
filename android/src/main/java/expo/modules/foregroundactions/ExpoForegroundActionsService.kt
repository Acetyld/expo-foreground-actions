package expo.modules.foregroundactions

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig


class ExpoForegroundActionsService : HeadlessJsTaskService() {
    companion object {
        const val SERVICE_NOTIFICATION_ID = 92901
        private const val CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL"
        fun buildNotification(
                context: Context,
                notificationTitle: String,
                notificationDesc: String,
                notificationColor: Int,
                notificationIconInt: Int,
                notificationProgress: Int,
                notificationMaxProgress: Int,
                notificationIndeterminate: Boolean
        ): Notification {
            val notificationIntent: Intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
//        val contentIntent: PendingIntent = when {
//            Build.VERSION.SDK_INT >= Build.VERSION_CODES.X -> PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_MUTABLE)
//            Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_MUTABLE)
//            Build.VERSION.SDK_INT >= Build.VERSION_CODES.M -> PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
//            else -> PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT)
//        }
            val contentIntent: PendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);
            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                    .setContentTitle(notificationTitle)
                    .setContentText(notificationDesc)
                    .setSmallIcon(notificationIconInt)
                    .setContentIntent(contentIntent)
                    .setOngoing(true)
                    .setProgress(notificationMaxProgress, notificationProgress, notificationIndeterminate)
                    .setPriority(NotificationCompat.PRIORITY_MIN)
                    .setColor(notificationColor)
            return builder.build()
        }
    }


    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val extras: Bundle? = intent?.extras
        requireNotNull(extras) { "Extras cannot be null" }


        val notificationTitle: String = extras.getString("notificationTitle")!!;
        val notificationDesc: String = extras.getString("notificationDesc")!!;
        val notificationColor: Int = Color.parseColor(extras.getString("notificationColor"))
        val notificationIconInt: Int = extras.getInt("notificationIconInt");
        val notificationProgress: Int = extras.getInt("notificationProgress");
        val notificationMaxProgress: Int = extras.getInt("notificationMaxProgress");
        val notificationIndeterminate: Boolean = extras.getBoolean("notificationIndeterminate");


        println("notificationIconInt");
        println(notificationIconInt);
        println("On create door dion")
        println("onStartCommand")
        createNotificationChannel() // Necessary creating channel for API 26+
        println("After createNotificationChannel")

        println("buildNotification")
        val notification: Notification = buildNotification(
                this,
                notificationTitle,
                notificationDesc,
                notificationColor,
                notificationIconInt,
                notificationProgress,
                notificationMaxProgress,
                notificationIndeterminate
        )
        println("Starting foreground")

        startForeground(SERVICE_NOTIFICATION_ID, notification)
        println("After foreground")
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        println("createNotificationChannel")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(CHANNEL_ID, "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT)
            val manager = getSystemService(NotificationManager::class.java)
            manager!!.createNotificationChannel(serviceChannel)
        }
    }

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        return intent.extras?.let {
            HeadlessJsTaskConfig(
                    intent.extras?.getString("headlessTaskName")!!,
                    Arguments.fromBundle(it),
                    0, // timeout for the task
                    true // optional: defines whether or not the task is allowed in foreground.
                    // Default is false
            )
        }
    }
}