import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishShopCommand implements Command {
	public get name(): string {
		return "낚시상점";
	}

	public get alias(): string[] {
		return ["ㅅㅈ", "s"];
	}

	public get description(): string {
		return "상점에 가면 낚싯대도 있고 미끼도 있고 칭호도 있고";
	}

	public get usage(): string {
		return "<타입 (낚싯대 | 미끼 | 칭호)>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const type = info.message.split(" ")[1];
		if (!type) return info.replier.reply("[ " + this.usage + " 식으로 입력해주세요! ]");
		if (!["낚싯대", "미끼", "칭호"].includes(type)) return info.replier.reply("[ 물고기, 낚싯대, 미끼 중 하나를 입력해주세요! ]");

		const texts = [`[ 낚시 상점을 보시려면 이 메시지를 클릭해주세요! ]${"\u200b".repeat(500)}\n가나다 순으로 정렬되어 있어요!`];
		const targets = (type === "낚싯대" ? FishUtils.FISH_DATABASE.lastData.rods : type === "미끼" ? FishUtils.FISH_DATABASE.lastData.baits : FishUtils.FISH_DATABASE.lastData.tags).sort((a, b) =>
			a.name.localeCompare(b.name)
		);

		for (let index = 0; index < targets.length; index++) {
			const target = targets[index];
			if (target.price === -1) continue;

			texts.push(`\n[${index}] ${target.name} - ${target.price}원`);
			if ("description" in target) texts.push(`	- ${target.description}`);
		}

		info.replier.reply(texts.join("\n"));
	}
}
