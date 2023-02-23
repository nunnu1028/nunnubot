import { MessageInfo, CommandManager, FunctionResult } from "core";

export enum GameManagerStatus {
	SUCCESS,
	ALREADY_EXISTS_NAME,
	ALREADY_JOINED,
	UNKNOWN_GAME_TYPE,
	DOES_NOT_EXIST,
	NOT_ONE_TO_ONE,
	GAME_PLAYING,
	GAME_FULL,
	MASTER_CHANGED,
	GAME_REMOVED
}

export enum GameStatus {
	READY,
	PLAYING,
	FULL
}

export interface Player {
	name: string;
	chatId: string;
	replier: Replier;
}

export interface Game<T extends Player = Player> {
	status: GameStatus;
	master: T;
	name: string;
	type: string;
	players: Map<string, T>;

	execute: (player: T, info: MessageInfo, manager: CommandManager, gameManager: GameManager) => void;
	onStart: (manager: CommandManager, gameManager: GameManager) => void;
}

export class GameManager {
	private _games: Map<string, Game<Player>> = new Map();
	private _gameClasses: Map<
		string,
		{
			new (name: string, master: Player): Game<Player>;
			onlyOneToOne: boolean;
		}
	> = new Map();
	private static _instance: GameManager;

	private _getGlobalPlayers(): Player[] {
		const globalPlayers: Player[] = [];
		this._games.forEach((game) => {
			globalPlayers.push(game.master);
			game.players.forEach((player) => {
				globalPlayers.push(player);
			});
		});

		return globalPlayers;
	}

	public static getInstance(): GameManager {
		if (!this._instance) this._instance = new GameManager();
		return this._instance;
	}

	public addGameClass(type: string, gameClass: { new (name: string, master: Player): Game<Player> }, onlyOneToOne: boolean): void {
		this._gameClasses.set(type, Object.assign(gameClass, { onlyOneToOne }));
	}

	public createGame(gameName: string, gameType: string, gameMaster: Player, isOpenChat: boolean, isGroupChat: boolean): FunctionResult {
		if (this._getGlobalPlayers().some((e) => e.chatId === gameMaster.chatId)) return { success: false, status: GameManagerStatus.ALREADY_JOINED };
		if (this._games.has(gameName)) return { success: false, status: GameManagerStatus.ALREADY_EXISTS_NAME };
		const gameClass = this._gameClasses.get(gameType);
		if (!gameClass) return { success: false, status: GameManagerStatus.UNKNOWN_GAME_TYPE };
		if ((!isOpenChat || isGroupChat) && gameClass.onlyOneToOne) return { success: false, status: GameManagerStatus.NOT_ONE_TO_ONE };

		const game = new gameClass(gameName, gameMaster);
		this._games.set(gameName, game);

		return { success: true, status: GameManagerStatus.SUCCESS };
	}

	public joinGame(gameName: string, player: Player, isOpenChat: boolean, isGroupChat: boolean): FunctionResult {
		if (this._getGlobalPlayers().some((e) => e.chatId === player.chatId)) return { success: false, status: GameManagerStatus.ALREADY_JOINED };
		const game = this._games.get(gameName);
		if (!game) return { success: false, status: GameManagerStatus.DOES_NOT_EXIST };
		if (game.status !== GameStatus.READY) return { success: false, status: game.status === GameStatus.PLAYING ? GameManagerStatus.GAME_PLAYING : GameManagerStatus.GAME_FULL };
		const gameClass = this._gameClasses.get(game.type);
		if ((!isOpenChat || isGroupChat) && gameClass.onlyOneToOne) return { success: false, status: GameManagerStatus.NOT_ONE_TO_ONE };

		game.players.set(player.chatId, player);

		return { success: true, status: GameManagerStatus.SUCCESS };
	}

	public leaveGame(gameName: string, player: Player): FunctionResult {
		const game = this._games.get(gameName);
		if (!game) return { success: false, status: GameManagerStatus.DOES_NOT_EXIST };
		if (!game.players.has(player.chatId)) return { success: false, status: GameManagerStatus.DOES_NOT_EXIST };

		game.players.delete(player.chatId);
		if (game.players.size === 0) {
			this._games.delete(gameName);
			return { success: true, status: GameManagerStatus.GAME_REMOVED };
		}

		if (game.master.chatId === player.chatId) {
			game.master.chatId = game.players.keys().next().value;
			return { success: true, status: GameManagerStatus.MASTER_CHANGED };
		}

		return { success: true, status: GameManagerStatus.SUCCESS };
	}

	public startGame(gameName: string, manager: CommandManager): FunctionResult {
		const game = this._games.get(gameName);
		if (!game) return { success: false, status: GameManagerStatus.DOES_NOT_EXIST };
		if (game.status !== GameStatus.READY) return { success: false, status: game.status === GameStatus.PLAYING ? GameManagerStatus.GAME_PLAYING : GameManagerStatus.GAME_FULL };

		game.status = GameStatus.PLAYING;
		game.onStart(manager, this);

		return { success: true, status: GameManagerStatus.SUCCESS };
	}

	public getGameByChatId(chatId: string): Game<Player> | undefined {
		return Array.from(this._games.values()).find((game) => game.master.chatId === chatId || game.players.has(chatId));
	}
}
