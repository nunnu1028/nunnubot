import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishMyInfoCommand implements Command {
	public get name(): string {
		return "낚시정보";
	}

	public get alias(): string[] {
		return ["ㅈㅂ", "mi"];
	}

	public get description(): string {
		return "내가 얼마나 잘 살았나";
	}

	public get usage(): string {
		return "";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const tag = user.tags[user.selectedTagIndex];
		const texts = [`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님의 정보 ]${"\u200b".repeat(500)}\n`];

		texts.push(`레벨: ${user.level.name} - ${user.currentLevel}`);
		texts.push(`보유중인 돈: ${user.money}원`);
		texts.push(`보유중인 호칭들: ${user.tags.length > 0 ? user.tags.map((e) => e.name).join(", ") : "없음"}`);
		texts.push(`보유중인 낚시대: ${user.rods.map((e) => e.name).join(", ")}`);
		texts.push(`사용중인 호칭: ${tag ? tag.name : "없음"}`);
		texts.push(`사용중인 낚시대: ${user.rods[user.selectedRodIndex].name}`);

		info.replier.reply(texts.join("\n"));
	}
}
