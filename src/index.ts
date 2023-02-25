import { PingPongCommand } from "commands";
import { CommandManager, notificationListener } from "core";
import { BangGame, GameChatCommand, CreateGameCommand, GameCommandLayer, GameManager, JoinGameCommand, RegisterUserCommand } from "game";

const commandManager = new CommandManager();
commandManager.addCommand(new PingPongCommand());

commandManager.addCommand(new RegisterUserCommand());
commandManager.addCommand(new CreateGameCommand());
commandManager.addCommand(new JoinGameCommand());

commandManager.addCommand(new GameCommandLayer());
commandManager.addCommand(new GameChatCommand());

const gameManager = GameManager.getInstance();
gameManager.addGameClass("bang", BangGame, false);

function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId?: string): void {
	commandManager.execute({ room, message, sender, isGroupChat, replier, imageDB, packageName, chatId });

	if (message === "!ping") {
		const ask = commandManager.ask({ room, message, sender, isGroupChat, replier, imageDB, packageName, chatId }, "pong?");
		const res = ask.get();
		replier.reply(res);
	}
}

function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;
}

const onNotificationPosted = notificationListener;
