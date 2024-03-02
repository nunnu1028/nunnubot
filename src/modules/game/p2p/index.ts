import { CheckLevelRes, Command, MessageInfo } from "core";
import EventEmitter from "dependency/event-emitter";

export * from "./game-command";

export interface P2PManagerEvents {
    sendAll: (text: string) => void;
    sendTo: (targetChatId: string, text: string) => void;
    onReceive: (chatId: string, info: MessageInfo) => void;
}

export class P2PManager extends EventEmitter<P2PManagerEvents> implements Command {
    private readonly _name: string;
    private readonly _instances: MessageInfo[] = [];

    constructor(private readonly _targetChatIds: string[]) {
        super();
        this._name = "*p2p" + new Date().getTime();

        this.on("sendAll", (message) => {
            for (const instance of this._instances) {
                instance.replier.reply(message);
            }
        });

        this.on("sendTo", (targetChatId, message) => {
            const instance = this._instances.find((e) => e.chatId === targetChatId);
            if (!instance) return;
            instance.replier.reply(message);
        });
    }

    public get name(): string {
		return this._name;
	}

	public get description(): string {
		return "Player To Player game message listener";
	}

	public get usage(): string {
		return "";
	}

    public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

    public async execute(info: MessageInfo): Promise<void> {
        if (!this._targetChatIds.includes(info.chatId)) return;
        this.emit("onReceive", info.chatId, info);

        if (this._instances.some((e) => e.chatId === info.chatId)) return;
        this._instances.push(info);
    }

    public addChatId(chatId: string): void {
        this._targetChatIds.push(chatId);
    }

    public removeChatId(chatId: string): void {
        this._targetChatIds.splice(this._targetChatIds.indexOf(chatId), 1);
    }

    public static getNewInstance(targetIds: string[]): P2PManager {
        return new P2PManager(targetIds);
    }
}

