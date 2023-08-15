import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishBaitsCommand implements Command {
	public get name(): string {
		return "미끼정보";
	}

	public get alias(): string[] {
		return ["ㅁㄲ", "b"];
	}

	public get description(): string {
		return "내가 가진 미끼미끼들은 뭐가 있지?";
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

		let texts = [`[ ${FishUtils.getUserName(user)}님의 미끼들 ]${"\u200b".repeat(500)}\n`];

		for (let index = 0; index < user.baits.length; index++) {
			const bait = user.baits[index];

			if (index === user.selectedRodIndex) {
				const arr = [`[ ${FishUtils.getUserName(user)}님의 미끼들 ]${"\u200b".repeat(500)}\n`];
				arr.push(`[${index}] ${bait.name} - ${bait.description} (현재 장착중)`);
				arr.push(`    가격: ${bait.price === -1 ? "구매&판매 불가" : `${bait.price}원`}\n`);

				texts = arr.concat(texts.slice(1));
			} else {
				texts.push(`[${index}] ${bait.name} - ${bait.description}`);
				texts.push(`    가격: ${bait.price === -1 ? "구매&판매 불가" : `${bait.price}원`}\n`);
			}
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
