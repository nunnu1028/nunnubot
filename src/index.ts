import { PingPongCommand } from "commands";
import { CommandManager, notificationListener } from "core";

const commandManager = new CommandManager();
commandManager.addCommand(new PingPongCommand());

function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId?: string): void {
	commandManager.execute({ room, message, sender, isGroupChat, replier, imageDB, packageName, chatId });

	if (message === "!ping") {
		replier.reply("pong, " + chatId);
	}
}

function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;
}

var onNotificationPosted = notificationListener;
