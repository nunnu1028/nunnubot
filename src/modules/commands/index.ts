<<<<<<< HEAD
import { CheckLevelRes, Command, MessageInfo } from "../core";
=======
import { CheckLevelRes, Command, MessageInfo } from "nunnu-module";
>>>>>>> d7a1ed1f858e6ed09510b2521bf3599f98f639c6

export class PingPongCommand implements Command {
	public get name(): string {
		return "ping";
	}

	public get description(): string {
		return "이게 핑퐁이지 씨@바꺼";
	}

	public get usage(): string {
		return "!ping";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo): void {
		info.replier.reply("pong, " + info.chatId);
	}
}
