export interface MessageInfo {
	room: string;
	message: string;
	sender: string;
	isGroupChat: boolean;
	replier: Replier;
	imageDB: ImageDB;
	packageName: string;
	chatId: string;
	hashedUserId: string;
}

export interface CheckLevelRes {
	permission: boolean;
	text?: string;
}

export interface Command {
	name: string;
	description: string;
	usage: string;
	alias?: string[];
	check_level: (info: MessageInfo) => CheckLevelRes;
	execute: (info: MessageInfo, manager: CommandManager, ...args: unknown[]) => void;
}

export class CommandManager {
	private _commandMap: Map<string, Command> = new Map();
	private readonly _askMap: Map<string, [resolve: (value: string) => void, reject: (reason?: never) => void]> = new Map();

	constructor(private readonly _prefix: string = "") {}

	public addCommand(command: Command): void {
		this._commandMap.set(command.name, command);

		if (command.alias) {
			for (const alias of command.alias) {
				this._commandMap.set(alias, command);
			}
		}
	}

	public removeCommand(command: Command): void {
		this._commandMap.delete(command.name);

		if (command.alias) {
			for (const alias of command.alias) {
				this._commandMap.delete(alias);
			}
		}
	}

	public getCommand(name: string): Command | undefined {
		const command = this._commandMap.get(name);

		if (!command) {
			const aliasCommand = Array.from(this._commandMap.values()).find((command) => command.alias?.includes(name));
			if (aliasCommand) return aliasCommand;
		}

		return command;
	}

	public get commands(): Command[] {
		return Array.from(this._commandMap.values());
	}

	public get commandMap(): Map<string, Command> {
		return this._commandMap;
	}

	public ask(
		info: MessageInfo,
		question: string
	): {
		get(): Promise<string>;
	} {
		info.replier.reply(question);

		const pr = new Promise<string>((resolve, reject) => {
			this._askMap.set(info.hashedUserId, [
				(res) => {
					resolve(res);
				},
				reject
			]);
		});

		return {
			get: async (): Promise<string> => {
				return pr;
			}
		};
	}

	public checkAsk(info: MessageInfo): boolean {
		if (this._askMap.has(info.hashedUserId)) {
			this._askMap.get(info.hashedUserId)[0](info.message);
			this._askMap.delete(info.hashedUserId);

			return true;
		}

		return false;
	}

	public execute(info: MessageInfo, checkingFunc: (info: MessageInfo) => boolean = this.checkAsk.bind(this)): void {
		if (checkingFunc(info)) return;

		if (!info.message.startsWith(this._prefix)) return;
		const command = this._commandMap.get(info.message.split(" ")[0].slice(this._prefix.length).toLowerCase());
		if (command && !command.name.startsWith("_")) {
			const level = command.check_level(info);
			if (!level.permission) return info.replier.reply(level.text ?? "권한이 없습니다. 관리자에게 문의하세요.");
			command.execute(info, this);
		}

		const globalCommands = this.commands.filter((command) => command.name.startsWith("*"));
		for (const command of globalCommands) {
			const level = command.check_level(info);
			if (!level.permission) continue;
			command.execute(info, this);
		}
	}
}

export namespace CommandParser {
	export function parseCommand(info: MessageInfo): { command: string; args: string[] } {
		const message = info.message;
		const command = message.split(" ")[0];
		const args = message.split(" ").slice(1);
		return { command, args };
	}
}
