import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishRodsCommand implements Command {
	public get name(): string {
		return "낚싯대정보";
	}

	public get alias(): string[] {
		return ["ㄴㅅㄷ", "r"];
	}

	public get description(): string {
		return "내가 가진 낚싯대들은 뭐가 있지?";
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

		let texts = [`[ ${FishUtils.getUserName(user)}님의 낚싯대들 ]${"\u200b".repeat(500)}\n`];

		for (let index = 0; index < user.rods.length; index++) {
			const rod = user.rods[index];

			if (index === user.selectedRodIndex) {
				const arr = [`[ ${FishUtils.getUserName(user)}님의 낚싯대들 ]${"\u200b".repeat(500)}\n`];
				arr.push(`[${index}] ${rod.name} - ${rod.description} (현재 장착중)`);
				arr.push(`	가격: ${rod.price === -1 ? "구매&판매 불가" : `${rod.price}원`}\n`);
				arr.push(`	확률: ${rod.percentage.rare + rod.percentage.epic + rod.percentage.legendary}%`);
				arr.push(`	내구도 성능: ${rod.maxCount !== -1 ? rod.maxCount / 1000 : 1}`); // 1000 is MAX

				texts = arr.concat(texts.slice(1));
			} else {
				texts.push(`[${index}] ${rod.name} - ${rod.description}`);
				texts.push(`	가격: ${rod.price === -1 ? "구매&판매 불가" : `${rod.price}원`}\n`);
				texts.push(`	확률: ${rod.percentage.rare + rod.percentage.epic + rod.percentage.legendary}%`);
				texts.push(`	내구도 성능: ${rod.maxCount !== -1 ? rod.maxCount / 1000 : 1}`);
			}
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
