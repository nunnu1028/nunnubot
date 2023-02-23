import { MessageInfo, CommandManager, FunctionResult } from "core";
import { Game, GameManager, GameStatus, Player } from "game";

export interface BangPlayer extends Player {
	role: BANG_ROLE;
	isDead: boolean;
	health: number;
	character: BangCharacter;
	maxHealth: number;
	items: BangItem[];
}

export enum BangPageType {
	BANGED
}

export interface BangItem {
	name: string;
	description: string;
	usage: string[];
	execute: (player: BangPlayer, game: BangGame, info: MessageInfo, manager: CommandManager) => void;
}

export interface BangCharacter {
	name: string;
	description: string;
	maxHealth: number;
	execute: (type: BangPageType, player: BangPlayer, game: BangGame, info: MessageInfo, manager: CommandManager) => FunctionResult<string>;
}

export interface BangCharacterClass {
	new (): BangCharacter;
}

export const BANG_CHARACTERS: BangCharacterClass[] = [];

export enum BANG_ROLE {
	Sheriff,
	Outlaw,
	Deputy,
	Rebel
}

export class BangGame implements Game<BangPlayer> {
	private _players: Map<string, BangPlayer> = new Map();
	private _status: GameStatus = GameStatus.READY;

	constructor(public readonly name: string, public readonly master: BangPlayer) {}

	public get status(): GameStatus {
		return this._status;
	}

	public set status(status: GameStatus) {
		this._status = status;
	}

	public get type(): string {
		return "bang";
	}

	public get players(): Map<string, BangPlayer> {
		return this._players;
	}

	private _setRoles(): void {
		const playerCount = this._players.size;
		const roles: BANG_ROLE[] =
			playerCount === 3
				? [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Rebel]
				: playerCount === 4
				? [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Deputy, BANG_ROLE.Rebel]
				: playerCount === 5
				? [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Deputy, BANG_ROLE.Rebel]
				: playerCount === 6
				? [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Deputy, BANG_ROLE.Deputy, BANG_ROLE.Rebel]
				: playerCount === 7
				? [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Deputy, BANG_ROLE.Deputy, BANG_ROLE.Rebel]
				: [];

		const players = Array.from(this._players.values());
		players.forEach((player) => {
			const role = roles[Math.floor(Math.random() * roles.length)];
			roles.splice(roles.indexOf(role), 1);
			player.role = role;
		});
	}

	private _setCharacters(): void {
		const characters = BANG_CHARACTERS.slice();
		const players = Array.from(this._players.values());
		players.forEach((player) => {
			const character = characters[Math.floor(Math.random() * characters.length)];
			characters.splice(characters.indexOf(character), 1);
			player.character = new character();
		});
	}

	public execute(player: Player, info: MessageInfo, manager: CommandManager, gameManager: GameManager): void {}

	public onStart(manager: CommandManager, gameManager: GameManager): void {
		this._setRoles();
		this._setCharacters();

		this._players.forEach((player) => {
			player.replier.reply(`게임이 시작되었습니다.\n당신의 직업: ${""}\n당신의 캐릭터: ${""}\n당신이 가진 아이템: ${""}`);
		});
	}
}
