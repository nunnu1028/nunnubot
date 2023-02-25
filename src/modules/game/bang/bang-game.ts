import { MessageInfo, CommandManager, FunctionResult, CommandParser } from "core";
import { Game, GameManager, GameStatus, Player } from "game";

export interface BangPlayer extends Player {
	role: BANG_ROLE;
	isDead: boolean;
	health: number;
	character: BangCharacter;
	maxHealth: number;
	items: BangItem[];
}

export enum BangType {
	BANGED
}

export enum BangResult {
	SUCCESS,
	USED_MISS,
	USED_MISS_TWO,
	NONE,
	NO_ITEM
}

export interface BangItem {
	name: string;
	description: string;
	usage: string[];
}

export interface BangCharacter {
	name: string;
	description: string;
	maxHealth: number;
	checkUseBang: (player: BangPlayer) => FunctionResult;
	checkBang: (isByTwo: boolean, player: BangPlayer, game: BangGame, info: MessageInfo, manager: CommandManager) => FunctionResult;
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
	private _nowTurn: BangPlayer | null = null;

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
				: [BANG_ROLE.Sheriff, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Outlaw, BANG_ROLE.Deputy, BANG_ROLE.Deputy, BANG_ROLE.Rebel];

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

	private _sendGlobalMessage(message: string, excludePlayers: BangPlayer[]): void {
		Array.from(this._players.values()).forEach((player) => {
			if (!excludePlayers.some((p) => p.chatId === player.chatId)) player.replier.reply(message);
		});
	}

	private _bang(player: BangPlayer, args: string[], info: MessageInfo, manager: CommandManager): void {
		if (this._nowTurn?.chatId !== info.chatId) return info.replier.reply("당신의 차례가 아닙니다!");
		if (!player.character.checkUseBang(player)) return info.replier.reply("당신은 뱅을 가지고 있지 않습니다!");
		const target = this._players.get(args.join(" "));
		if (!target) return info.replier.reply("해당 유저를 찾을 수 없습니다.");

		this._sendGlobalMessage(`${player.name}님이 ${target.name}님을 뱅으로 공격하였습니다!`, [player, target]);
		info.replier.reply("공격을 시도하였습니다.");
		const result = target.character.checkBang(false, target, this, info, manager);
		if (result.success) return this._sendGlobalMessage(`아이쿠! 상대가 뱅을 회피하였습니다. ${result.status === BangResult.USED_MISS_TWO && "(뱅을 빗나감 두개로 회피하였습니다.)"}`, [target]);

		target.health -= 1;
		player.items.splice(
			player.items.findIndex((item) => item.name === "bang"),
			1
		);

		this._sendGlobalMessage(`${target.name}님이 공격을 받았습니다! 남은 체력: ${target.health}`, [target]);

		if (target.health <= 0) {
			// hi
		}
	}

	public execute(player: BangPlayer, info: MessageInfo, manager: CommandManager, gameManager: GameManager): void {
		if (player) return info.replier.reply("죽은 사람은 게임을 진행할 수 없습니다.");
		const parsed = CommandParser.parseCommand(info);

		if (parsed.command === "bp") {
			this._bang(player, parsed.args, info, manager);
		}
	}

	public onStart(manager: CommandManager, gameManager: GameManager): void {
		this._setRoles();
		this._setCharacters();

		this._players.forEach((player) => {
			player.replier.reply(`게임이 시작되었습니다.\n당신의 직업: ${""}\n당신의 캐릭터: ${""}\n당신이 가진 아이템: ${""}`);
		});
	}
}
