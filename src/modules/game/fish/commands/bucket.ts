import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishBucketCommand implements Command {
	public get name(): string {
		return "낚시양동이";
	}

	public get alias(): string[] {
		return ["양동이", "ㅇㄷㅇ", "b"];
	}

	public get description(): string {
		return "내가 뭘 잡았더라";
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
		const texts = [`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님의 양동이 ]${"\u200b".repeat(500)}\n`];

		for (let index = 0; index < user.fishes.length; index++) {
			const fish = user.fishes[index];

			texts.push(`[${index}] ${fish.name} - ${fish.description}`);
			texts.push(`    등급: ${fish.level}`);
			texts.push(`    길이: ${fish.length}cm`);
			texts.push(`    가격: ${fish.price}원\n`);
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
