import { PingPongCommand } from "commands";
<<<<<<< HEAD
import { CommandManager, notificationListener } from "core";
=======
import { CommandManager, notificationListener } from "nunnu-module";
>>>>>>> d7a1ed1f858e6ed09510b2521bf3599f98f639c6

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
