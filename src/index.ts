import { notificationListener } from "nunnu-module";

// Production
function onMessage(
	room: string,
	message: string,
	sender: string,
	isGroupChat: boolean,
	replier: Replier,
	imageDB: ImageDB,
	packageName: string,
	chatId: string
): void {}

// DebugRoom
function response(
	room: string,
	message: string,
	sender: string,
	isGroupChat: boolean,
	replier: Replier,
	imageDB: ImageDB,
	packageName: string
): void {
	if (packageName !== "com.xfl.msgbot") return;
}

var onNotificationPosted = notificationListener;
