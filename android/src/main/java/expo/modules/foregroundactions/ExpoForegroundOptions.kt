package expo.modules.foregroundactions

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ExpoForegroundOptions : Record {
    @Field
    val headlessTaskName: String = "default"

    @Field
    val notificationTitle: String = "Notification Title"

    @Field
    val notificationDesc: String = "Notification Description"

    @Field
    val notificationColor: String = "#FFC107"

    @Field
    val notificationIconName: String = "ic_launcher"

    @Field
    val notificationIconType: String = "mipmap"

    @Field
    val notificationProgress: Int = 0

    @Field
    val notificationMaxProgress: Int = 100

    @Field
    val notificationIndeterminate: Boolean = false

    @Field
    val linkingURI: String = ""
}
