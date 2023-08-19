import { CheckLevelRes, Command, MessageInfo } from "core";

export class FishTipsCommand implements Command {
	private readonly _replierList: {
		chatId: string;
		replier: Replier;
	}[] = [];
	private readonly _addedChatIds: string[] = ["18300286144641024"];
	private readonly _tipList: string[] = [
		"한강에서는 원래 고등어가 나오지 않지만, 이 게임에서는 나옵니다!",
		"글롬마 강은 노르웨이에 있어, 연어가 많이 나옵니다. 꼭 잡아보세요!",
		"철갑상어는 경험치와 돈을 굉장히 많이 줍니다. 평범한 강가에서 나오니 잡아보세요!",
		"샤카밤바스피스는 멸종되었는데, 이를 복원한 모양을 보면.. 꽤 귀엽습니다. ><",
		"가끔씩 집에서 라면 끓여먹을때 남은 국물에 계란 풀어서 전자렌지 돌려 찜 해먹으면 정말 맛있습니다."
	];

	public get name(): string {
		return "*tips";
	}

	public get description(): string {
		return "";
	}

	public get usage(): string {
		return "";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (this._addedChatIds.includes(info.chatId) && !this._replierList.some((e) => e.chatId === info.chatId)) this._replierList.push({ chatId: info.chatId, replier: info.replier });

		setInterval(() => {
			info.replier.reply("[낚시게임 팁] " + this._tipList[Math.floor(Math.random() * this._tipList.length)]);
		}, 1000 * 60 * 15);
	}
}
