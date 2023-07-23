import { PingPongCommand } from "commands";
import { CommandManager, notificationListener } from "core";
import { GameChatCommand, CreateGameCommand, GameCommandLayer, GameManager, JoinGameCommand, RegisterUserCommand } from "game";

const emulatorMode = typeof process !== "undefined" && process.argv.includes("--emulator");

if (emulatorMode) {
	require("emulator").supportEmulatorMode();
}

const commandManager = new CommandManager();
commandManager.addCommand(new PingPongCommand());

commandManager.addCommand(new RegisterUserCommand());
commandManager.addCommand(new CreateGameCommand());
commandManager.addCommand(new JoinGameCommand());

commandManager.addCommand(new GameCommandLayer());
commandManager.addCommand(new GameChatCommand());

const gameManager = GameManager.getInstance();

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

	if (message === "!ping") {
		const ask = commandManager.ask({ room, message, sender, isGroupChat, replier, imageDB, packageName, chatId, hashedUserId }, "pong? " + chatId + ": " + hashedUserId);
		const res = await ask.get();
		replier.reply(res);
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
