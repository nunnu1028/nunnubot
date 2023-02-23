import { Command, MessageInfo, CheckLevelRes, CommandManager, CommandParser } from "core";
import { UserDatabase, Player, GameManager, GAME_MANAGER_STATUS } from "game";

export class CreateGameCommand implements Command {
	public get name(): string {
		return "cg";
	}

	public get description(): string {
		return "게임을 생성합니다.";
	}

	public get usage(): string {
		return "cg <게임이름> <방이름>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo, manager: CommandManager): void {
		const command = CommandParser.parseCommand(info);
		const userDatabase = UserDatabase.getInstance();
		const user = userDatabase.getUser(info.chatId);
		if (!user) return info.replier.reply("가입되지 않은 계정입니다. ru 명령어로 가입해주세요.");

		const gameType = command.args[0];
		const gameName = command.args.slice(1).join(" ");

		if (!gameType) return info.replier.reply("게임 이름을 입력해주세요.");
		if (!gameName) return info.replier.reply("방 이름을 입력해주세요.");

		const player: Player = {
			chatId: info.chatId,
			name: user.name,
			replier: info.replier
		};

		const gameManager = GameManager.getInstance();
		const game = gameManager.createGame(gameName, gameType, player, info.chatId.length === 17, info.isGroupChat);
		if (game.success) return info.replier.reply(`게임을 생성하였습니다. 방 이름: ${gameName}`);

		const text = GAME_MANAGER_STATUS[game.status];
		if (!text) return info.replier.reply("알 수 없는 오류입니다. Status: " + game.status);
		info.replier.reply(text);
	}
}
