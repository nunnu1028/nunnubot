import { Command, MessageInfo, CheckLevelRes, CommandManager } from "core";
import { P2PGameData, P2PGameInfo, P2PGameManager } from "./game-manager";
import { P2PManager, getGameDatabase } from "game";

export class P2PCreateGameCommand implements Command {
    constructor(private readonly _p2pGameManager: P2PGameManager) {}

	public get name(): string {
		return "개인전방생성";
	}

	public get alias(): string[] {
		return ["ㄱㅂㅅ", "ㄱㅄ"];
	}

	public get description(): string {
		return "개인전 게임 방을 생성합니다.";
	}

	public get usage(): string {
		return "게임타입 방이름 (예시: 개인정방생성 mafia 마피아 할사람 구함 ㅋ";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo, manager: CommandManager): Promise<void> {
        if (this._p2pGameManager.gameInfos.some((e) => e.playerChatIds.includes(info.chatId))) 
            return info.replier.reply("현재 다른 게임에 참가하고 있어 개인전을 생성할 수 없습니다.");

        const args = info.message.split(" ").slice(1);
        if (!["mafia"].includes(args[0])) return info.replier.reply(`지원하지 않는 게임입니다. (지원 게임: mafia)`);
        if (args.length < 2) return info.replier.reply("방 이름을 입력해주세요.");
        if (args.slice(1).join(" ").length > 20) return info.replier.reply("방 이름은 20자 이하로 입력해주세요.");
        if (this._p2pGameManager.gameInfos.some((e) => e.name === args.slice(1).join(" "))) return info.replier.reply("이미 존재하는 방 이름입니다.");
        const gameDatabase = getGameDatabase();

        if (!gameDatabase.lastData.userNameDict[info.chatId]) {
            const name = await manager.ask(info, "게임에 사용할 이름을 입력해주세요.").get();
            if (!name) return info.replier.reply("입력이 취소되었습니다.");
            if (gameDatabase.lastData.userNameDict[info.chatId]) return info.replier.reply("다른 유저가 이미 사용 중인 이름입니다.");
            if (name.length > 20) return info.replier.reply("이름은 20자 이하로 입력해주세요.");

            const yORn = await manager.ask(info, `입력한 이름이 ${name}이 맞습니까? (y/n)`).get();
            if (yORn.toLowerCase() !== "y") return info.replier.reply("입력이 취소되었습니다.");
            
            gameDatabase.lastData.userNameDict[info.chatId] = name;
            gameDatabase.save(gameDatabase.lastData);
        }

        const name = gameDatabase.lastData.userNameDict[info.chatId];
        const gameInfo: P2PGameInfo = {
            name: args.slice(1).join(" "),
            ownerChatId: info.chatId,
            playerChatIds: [info.chatId],
            playerNameDict: {
                [info.chatId]: name
            },
            gameType: args[0] as any,
            maxPlayerCount: P2PGameData[args[0]].maxPlayerCount,
            minPlayerCount: P2PGameData[args[0]].minPlayerCount,
            isStarted: false,
            p2pManager: P2PManager.getNewInstance([info.chatId])
        };
        
        this._p2pGameManager.createGame(gameInfo);
        info.replier.reply(`게임 방이 생성되었습니다. 방 이름: ${name}`);

        manager.addCommand(gameInfo.p2pManager);
	}
}
