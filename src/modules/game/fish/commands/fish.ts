import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishCommand implements Command {
	public get name(): string {
		return "낚시";
	}

	public get alias(): string[] {
		return ["fish", "f", "ㄴㅅ"];
	}

	public get description(): string {
		return "고기를 잡으러 산으로 갈까말까 바다로 가야지";
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

		const rod = FishUtils.FISH_DATABASE.lastData.rods.find((e) => e.id === user.selectedRodId);
		if (!rod) throw new Error("Rod not found, rod: " + user.selectedRodId + ", user: " + user.id);

		const bait = FishUtils.FISH_DATABASE.lastData.baits.find((e) => e.id === user.currentBaitId);
		const tag = user.selectedTagId ? FishUtils.FISH_DATABASE.lastData.tags.find((e) => e.id === user.selectedTagId) : null;
		const fish = FishUtils.getRandomFish(rod, bait, FishUtils.FISH_DATABASE.lastData.fishes);
		const time = FishUtils.getRandomNumber(rod.speedBetween[0], rod.speedBetween[1]);
		const exp = FishUtils.getFishExp(fish.length, fish.price, rod.exp);

		info.replier.reply("낚시를 시작합니다..");
		await FishUtils.sleep(time);

		const finishedTexts = [
			`${user.name}${tag ? ` [${tag.name}]` : ""}님이 물고기를 낚았어요!`,
			"정보:",
			`	이름: ${fish.name}`,
			`	설명: ${fish.description}`,
			`	등급: ${fish.level}`,
			`	길이: ${fish.length}cm`,
			`	가격: ${fish.price}원`,
			`	오른 경험치: ${exp}`
		];

		info.replier.reply(finishedTexts.join("\n"));

		user.fishes.push(fish);
		user.currentExp += exp;
		FishUtils.FISH_DATABASE.save(FishUtils.FISH_DATABASE.lastData);

		if (user.currentExp - user.level.requiredExp - (user.currentLevel - 1) * user.level.requiredExpToNextLevel > user.level.requiredExpToNextLevel) {
			user.currentLevel += 1;

			if (user.currentLevel === user.level.levelBetween[1] + 1) {
				const nextLevel = FishUtils.FISH_DATABASE.lastData.levels.find((e) => e.levelBetween[0] === user.level.levelBetween[1] + 1);
				if (nextLevel) {
					user.level = nextLevel;
					user.currentLevel = nextLevel.levelBetween[0];
					FishUtils.FISH_DATABASE.save(FishUtils.FISH_DATABASE.lastData);

					return info.replier.reply(["축하합니다! 다음 단계로 레벨업 하셨어요!", "레벨업 정보:", `	레벨단계: ${user.level.name}`, `	레벨: ${user.level.levelBetween[0]}레벨`].join("\n"));
				}
			}

			FishUtils.FISH_DATABASE.save(FishUtils.FISH_DATABASE.lastData);
			info.replier.reply(["축하합니다! 레벨업 하셨어요!", "레벨업 정보:", `	레벨단계: ${user.level.name}`, `	레벨: ${user.currentLevel}레벨`].join("\n"));
		}
	}
}
