// @ts-nocheck

export function notificationListener(sbn: android.service.notification.StatusBarNotification, sm: any) {
	var packageName = sbn.getPackageName();
	if (!packageName.startsWith("com.kakao.tal")) return;

	var actions = sbn.getNotification().actions;
	if (actions == null) return;

	for (var n = 0; n < actions.length; n++) {
		var action = actions[n];
		if (action.getRemoteInputs() == null) continue;

		var bundle = sbn.getNotification().extras;
		var chatId = sbn.getTag();
		var msg = bundle.get("android.text").toString();
		var sender = bundle.getString("android.title");

		var room = bundle.getString("android.subText");
		if (room == null) room = bundle.getString("android.summaryText");

		var isGroupChat = room != null;
		if (room == null) room = sender;

		var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
		var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
		var image = bundle.getBundle("android.wearable.EXTENSIONS");
		if (image != null) image = image.getParcelable("background") as android.os.Bundle;

		var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
		com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);

		if (this.hasOwnProperty("onMessage")) {
			onMessage(room, msg, sender, isGroupChat, replier, imageDB, packageName, chatId);
		}
	}
}
