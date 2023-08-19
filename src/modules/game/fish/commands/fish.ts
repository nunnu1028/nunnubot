import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishCommand implements Command {
	private readonly _fishingList: string[] = [];

	public get name(): string {
		return "낚시";
	}

	public get alias(): string[] {
		return ["ㄴㅅ", "f", "나낏"];
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
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");
		if (this._fishingList.includes(info.hashedUserId)) return info.replier.reply("[ 이미 낚시중이에요! ]");

		const rod = user.rods[user.selectedRodIndex];
		const bait = user.baits[user.selectedBaitIndex];
		const tag = user.tags[user.selectedTagIndex];
		const room = FishUtils.FISH_DATABASE.lastData.rooms.find((e) => e.id === user.currentRoomId);
		const fish = FishUtils.getRandomFish(room, rod, bait, FishUtils.FISH_DATABASE.lastData.fishes);
		const time = FishUtils.getRandomNumber(rod.speedBetween[0], rod.speedBetween[1] - bait.speedEffect);
		const exp = FishUtils.getFishExp(fish.length, rod.exp, fish.exp);

		info.replier.reply("[ 낚시를 시작합니다.. 무엇이 낚일까요.. ]");
		this._fishingList.push(info.hashedUserId);
		await FishUtils.sleep(time);
		this._fishingList.splice(this._fishingList.indexOf(info.hashedUserId), 1);
		rod.usedCount++;

		if (rod.maxCount !== -1 && rod.usedCount > rod.maxCount) {
			info.replier.reply(`[ 아이고 이런! 낚싯대가 부러졌어요! 물고기가 도망가버렸어요..\n  기본 낚싯대로 변경됨. ]`);
			user.rods.splice(user.selectedRodIndex, 1);
			user.selectedRodIndex = user.rods.findIndex((e) => e.id === "NORMAL") || 0;

			return;
		}

		const finishedTexts = [
			`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님이 물고기를 낚았어요! ]\n`,
			"정보:",
			`	이름: ${fish.name}`,
			`	설명: ${fish.description}`,
			`	등급: ${fish.level}`,
			`	길이: ${fish.length}cm`,
			`	가격: ${fish.price}원`,
			`	오른 경험치: ${exp}\n`
		];

		if (user.selectedBaitIndex !== 0) {
			finishedTexts.push(`${bait.name}을 한개 소진함.`);

			user.baits.splice(user.selectedBaitIndex, 1);
			user.selectedBaitIndex = user.baits.findIndex((e) => e.id === bait.id) || 0;
			if (user.selectedBaitIndex === 0) {
				finishedTexts.push(`${bait.name} 미끼를 다 소진하여 기본 미끼로 변경됨.`);
			}
		}

		info.replier.reply(finishedTexts.join("\n").trim());

		user.fishes.push(fish);
		user.caughtFishIds.push(fish.id);
		user.currentLevelExp += exp;
		user.currentExp += exp;

		const currentLevelTemp = user.currentLevel;

		if (user.currentLevelExp > user.level.requiredExpToNextLevel) {
			user.currentLevel += Math.floor(user.currentLevelExp / user.level.requiredExpToNextLevel);
			user.currentLevelExp = user.currentLevelExp % user.level.requiredExpToNextLevel;

			if (user.currentLevel > user.level.levelBetween[1] && user.level.levelBetween[1] !== -1) {
				const nextLevel = FishUtils.FISH_DATABASE.lastData.levels.find((e) => (e.levelBetween[1] > user.currentLevel || e.levelBetween[1] === -1) && e.levelBetween[0] <= user.currentLevel);
				if (nextLevel) {
					user.level = nextLevel;
					const unlockedItemTexts = [];

					for (const room of FishUtils.FISH_DATABASE.lastData.rooms) {
						if (room.requiredLevel < user.currentLevel && room.requiredLevel > currentLevelTemp) {
							unlockedItemTexts.push(`- 이제 ${room.name}에 들어갈 수 있어요! 이동 커맨드를 치면 이동할 수 있답니다!`);
						}
					}

					info.replier.reply(["[ 축하합니다! 다음 단계로 레벨업 하셨어요! ]\n", "레벨업 정보:", `	레벨단계: ${user.level.name}`, `	레벨: ${user.level.levelBetween[0]}레벨`].join("\n"));
					if (unlockedItemTexts.length > 0) {
						info.replier.reply(`[ ${unlockedItemTexts.join("\n  ")} ]`);
					}

					return;
				}
			}

			info.replier.reply(["[ 축하합니다! 레벨업 하셨어요! ]\n", "레벨업 정보:", `	레벨단계: ${user.level.name}`, `	레벨: ${user.currentLevel}레벨`].join("\n"));
		}
	}
}
