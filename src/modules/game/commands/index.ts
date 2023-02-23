export * from "./user";

export * from "./game-command-layer";
export * from "./game-chat";
export * from "./create-game";
export * from "./join-game";

import { MessageInfo, CheckLevelRes, CommandManager, Command } from "core";
import { Player, Game, GameManager } from "game";

export interface GameCommand<T extends Player = Player> extends Command {
	name: string;
	description: string;
	usage: string;
	check_level: (info: MessageInfo) => CheckLevelRes;
	execute: (info: MessageInfo, manager: CommandManager, game: Game<T>, gameManager: GameManager) => void;
}
