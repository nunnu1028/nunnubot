import { notificationListener, WebClient } from "nunnu-module";

// Production
function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId: string): void {}

// DebugRoom
function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;

	const client = new WebClient("https://jsonplaceholder.typicode.com");
	client.request("GET", "/todos/1", {});
}

var onNotificationPosted = notificationListener;
