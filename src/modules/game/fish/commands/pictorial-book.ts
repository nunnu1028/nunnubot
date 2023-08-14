import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";
import { FishLevel } from "../fish-data";

export class FishPictorialBookCommand implements Command {
	public get name(): string {
		return "낚시도감";
	}

	public get alias(): string[] {
		return ["ㄷㄱ", "p"];
	}

	public get description(): string {
		return "내가 뭘 못잡아봤더라";
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

		const texts = [`[ 낚시 도감을 보시려면 이 메시지를 클릭해주세요! ]${"\u200b".repeat(500)}\n가나다 순으로 정렬되어 있어요!`];

		for (const level in FishLevel) {
			const fishes = FishUtils.FISHES.filter((fish) => fish.level === level).sort((a, b) => a.name.localeCompare(b.name));
			texts.push(`\n[ ${level} ]`);
			if (fishes.length === 0) {
				texts.push("\n아직 이 레벨의 물고기는 추가되지 않았어요!");
				continue;
			}

			// 잡아봄/안잡아봄 구분예정
			for (const fish of fishes) {
				texts.push(`\n${fish.name} - ${fish.description}`);
				texts.push(`	최소 길이: ${fish.minLength}cm`);
				texts.push(`	최대 길이: ${fish.maxLength}cm`);
			}
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
