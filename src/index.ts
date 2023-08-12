import { HelpCommand } from "commands";
import { CommandManager, notificationListener } from "core";
import { FishBucketCommand, FishCommand, FishMoveCommand, FishMyInfoCommand, FishRegisterCommand } from "game";

const emulatorMode = typeof process !== "undefined" && process.argv.includes("--emulator");

if (emulatorMode) {
	require("emulator").supportEmulatorMode();
}

const commandManager = new CommandManager();
commandManager.addCommand(new HelpCommand());

commandManager.addCommand(new FishCommand());
commandManager.addCommand(new FishRegisterCommand());
commandManager.addCommand(new FishMoveCommand());
commandManager.addCommand(new FishBucketCommand());
commandManager.addCommand(new FishMyInfoCommand());

async function onMessage(
	room: string,
	message: string,
	sender: string,
	isGroupChat: boolean,
	replier: Replier,
	imageDB: ImageDB,
	packageName: string,
	chatId: string,
	hashedUserId: string
): Promise<void> {
	commandManager.execute({ room, message, sender, isGroupChat, replier, imageDB, packageName, chatId, hashedUserId });

	if (hashedUserId === "04a87152c50442ce90215958afcdd042748aedf3586bf93af6a819b59f2e5283" && message.startsWith("ev ")) {
		try {
			replier.reply(eval(message.split(" ").slice(1).join(" ")));
		} catch (e) {
			replier.reply("Error: " + e.message + "\nst: " + e.stack);
		}
	}
}

function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;
}

if (emulatorMode) {
	require("emulator").startEmulatorMode(onMessage.bind(this));
}

const onNotificationPosted = notificationListener;
eval(`var Promise = require("dependency/promise").Promise;`); // for Promise on rhino
