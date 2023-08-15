import { HelpCommand } from "commands";
import { CommandManager, notificationListener } from "core";
import {
	FishBaitsCommand,
	FishBucketCommand,
	FishBuyCommand,
	FishChangeBaitCommand,
	FishChangeRodCommand,
	FishChangeTagCommand,
	FishCommand,
	FishMoveCommand,
	FishMyInfoCommand,
	FishPictorialBookCommand,
	FishRegisterCommand,
	FishRodsCommand,
	FishSellCommand,
	FishShopCommand
} from "game";

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
commandManager.addCommand(new FishRodsCommand());
commandManager.addCommand(new FishSellCommand());
commandManager.addCommand(new FishChangeRodCommand());
commandManager.addCommand(new FishPictorialBookCommand());
commandManager.addCommand(new FishShopCommand());
commandManager.addCommand(new FishBaitsCommand());
commandManager.addCommand(new FishBuyCommand());
commandManager.addCommand(new FishChangeBaitCommand());
commandManager.addCommand(new FishChangeTagCommand());

function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId: string, hashedUserId: string): void {
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
