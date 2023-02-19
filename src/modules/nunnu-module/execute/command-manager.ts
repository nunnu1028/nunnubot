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
	execute: (info: MessageInfo, manager: CommandManager) => void;
}

export class CommandManager {
	private _commandMap: Map<string, Command> = new Map();
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

	public execute(info: MessageInfo): void {
		if (!info.message.startsWith(this._prefix)) return;
		const command = this._commandMap.get(info.message.split(" ")[0].slice(this._prefix.length));
		if (command) {
			const level = command.check_level(info);
			if (!level.permission) return info.replier.reply(level.text ?? "권한이 없습니다.");
			command.execute(info, this);
		}
	}
}
