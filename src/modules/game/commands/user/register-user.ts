import { CheckLevelRes, Command, CommandManager, CommandParser, MessageInfo } from "core";
import { UserDatabase } from "game";

export class RegisterUserCommand implements Command {
	public get name(): string {
		return "ru";
	}

	public get description(): string {
		return "계정을 가입합니다.";
	}

	public get usage(): string {
		return "ru <계정이름>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo, manager: CommandManager): void {
		const command = CommandParser.parseCommand(info);
		if (!command.args[0]) return info.replier.reply("계정 이름을 입력해주세요.");

		const userDatabase = UserDatabase.getInstance();
		if (userDatabase.getUserByName(command.args[0])) return info.replier.reply("이미 존재하는 계정 이름입니다.");
		if (userDatabase.getUser(info.chatId)) return info.replier.reply("이미 가입된 계정입니다.");

		userDatabase.registerUser({ id: info.chatId, name: command.args[0], chatHistory: [] });
		info.replier.reply("계정을 가입하였습니다! 이제 게임을 즐기실 수 있어요~");
	}
}
