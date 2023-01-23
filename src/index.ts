import { DatabaseManager, notificationListener, WebClient } from "nunnu-module";

// Production
function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId: string): void {}

// DebugRoom
function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;

	const db = new DatabaseManager<Record<any, any>>(
		"./sdcard/data.json",
		(data: any) => {
			return JSON.parse(data);
		},
		(data: any) => {
			return JSON.stringify(data);
		}
	);

	db.save({ test: "test" });

	const data = db.load();

	replier.reply(JSON.stringify(data));
}

var onNotificationPosted = notificationListener;
