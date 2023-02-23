import { CheckLevelRes, Command, CommandManager, CommandParser, MessageInfo } from "core";
import { GameCommand, GameManager } from "game";

export class GameCommandLayer implements Command {
	public get name(): string {
		return "*gameCommandLayer";
	}

	public get description(): string {
		return "";
	}

	public get usage(): string {
		return "";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo, manager: CommandManager): void {
		const gameManager = GameManager.getInstance();
		const game = gameManager.getGameByChatId(info.chatId);
		if (!game) return;

		const parsed = CommandParser.parseCommand(info);
		const command = manager.getCommand("_" + parsed.command) as GameCommand;
		if (!command) return;

		command.execute(info, manager, game, gameManager);
	}
}
