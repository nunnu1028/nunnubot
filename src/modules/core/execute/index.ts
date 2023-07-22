export interface MessageInfo {
	room: string;
	message: string;
	sender: string;
	isGroupChat: boolean;
	replier: Replier;
	imageDB: ImageDB;
	packageName: string;
	chatId?: string;
}

export interface CheckLevelRes {
	permission: boolean;
	text?: string;
}

export interface Command {
	name: string;
	description: string;
	usage: string;
	check_level: (info: MessageInfo) => CheckLevelRes;
	execute: (info: MessageInfo, manager: CommandManager, ...args: unknown[]) => void;
}

export class CommandManager {
	private _commandMap: Map<string, Command> = new Map();
	private readonly _askMap: Map<string, [resolve: (value: string) => void, reject: (reason?: never) => void]> = new Map();

	constructor(private readonly _prefix: string = "") {}

	public addCommand(command: Command): void {
		this._commandMap.set(command.name, command);
	}

	public removeCommand(command: Command): void {
		this._commandMap.delete(command.name);
	}

	public getCommand(name: string): Command | undefined {
		return this._commandMap.get(name);
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
			this._askMap.set(info.chatId, [
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
		if (this._askMap.has(info.chatId)) {
			this._askMap.get(info.chatId)[0](info.message);
			this._askMap.delete(info.chatId);

			return true;
		}

		return false;
	}

	public execute(info: MessageInfo, checkingFunc: (info: MessageInfo) => boolean = this.checkAsk.bind(this)): void {
		if (checkingFunc(info)) return;

		if (!info.message.startsWith(this._prefix)) return;
		const command = this._commandMap.get(info.message.split(" ")[0].slice(this._prefix.length));
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
