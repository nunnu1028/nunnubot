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
		if (!user) return info.replier.reply("낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요!");

		const tag = user.selectedTagId ? FishUtils.FISH_DATABASE.lastData.tags.find((e) => e.id === user.selectedTagId) : null;
		let texts = [`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님의 낚싯대들 ]${"\u200b".repeat(500)}\n`];

		for (let index = 0; index < user.rodIds.length; index++) {
			const rodId = user.rodIds[index];
			const rod = FishUtils.FISH_DATABASE.lastData.rods.find((e) => e.id === rodId)!;

			if (rod.id === user.selectedRodId) {
				const arr = [`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님의 낚싯대들 ]${"\u200b".repeat(500)}\n`];
				arr.push(`[${index}] ${rod.name} - ${rod.description} (현재 장착중)`);
				arr.push(`    가격: ${rod.price === -1 ? "구매&판매 불가" : `${rod.price}원`}\n`);

				texts = arr.concat(texts.slice(1));
			} else {
				texts.push(`[${index}] ${rod.name} - ${rod.description}`);
				texts.push(`    가격: ${rod.price === -1 ? "구매&판매 불가" : `${rod.price}원`}\n`);
			}
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
