/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export function notificationListener(sbn: android.service.notification.StatusBarNotification, sm: unknown) {
	const packageName = sbn.getPackageName();
	if (!packageName.startsWith("com.kakao.talb")) return;
	//	if (packageName === "com.kakao.talk" && ![95].includes(sbn.getUserId())) return; // for 듀얼메신저

	const actions = sbn.getNotification().actions;
	if (actions == null) return;

	for (let n = 0; n < actions.length; n++) {
		const action = actions[n];
		if (action.getRemoteInputs() == null) continue;

		const bundle = sbn.getNotification().extras;
		const chatId = sbn.getTag();
		const msg = bundle.get("android.text").toString();
		const sender = bundle.getString("android.title");

		let room = bundle.getString("android.subText");
		if (room == null) room = bundle.getString("android.summaryText");

		const isGroupChat = room != null;
		if (room == null) room = sender;

		const replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
		const icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
		let image = bundle.getBundle("android.wearable.EXTENSIONS");
		if (image != null) image = image.getParcelable("background") as android.os.Bundle;
		const hashedUserId = bundle.getParcelableArray("android.messages")[0].get("sender_person").getKey();

		const imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
		com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);

		if (this.hasOwnProperty("onMessage")) {
			onMessage(room, msg, sender, isGroupChat, replier, imageDB, packageName, chatId, hashedUserId);
		}
	}
}
