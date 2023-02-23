import { CheckLevelRes, CommandManager, CommandParser, MessageInfo } from "core";
import { Game, GameManager, UserDatabase, GameCommand } from "game";

export class GameChatCommand implements GameCommand {
	public get name(): string {
		return "_ch";
	}

	public get description(): string {
		return "Chat to other players";
	}

	public get usage(): string {
		return "_ch <message>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo, manager: CommandManager, game: Game, gameManager: GameManager): void {
		const userDatabase = UserDatabase.getInstance();
		const user = userDatabase.getUser(info.chatId);
		if (!user) return info.replier.reply("가입되지 않은 계정입니다. ru 명령어로 가입해주세요.");

		const player = game.players.get(info.chatId) || game.master.chatId === info.chatId ? game.master : null;
		if (!player) return info.replier.reply("게임에 참가하지 않았습니다.");

		const command = CommandParser.parseCommand(info);
		const message = command.args.join(" ");
		if (!message) return info.replier.reply("메시지를 입력해주세요.");

		user.chatHistory.push(command.args.join(" "));
		userDatabase.dataBase.save(userDatabase.dataBase.lastData);

		Array.from(game.players.values())
			.concat([game.master])
			.forEach((p) => {
				if (p.chatId === info.chatId) return p.replier.reply(`[나] ${message}`);
				p.replier.reply(`${player.name}: ${message}`);
			});
	}
}
