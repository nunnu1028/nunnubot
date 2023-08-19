import { CheckLevelRes, Command, CommandManager, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";
import { FishLevel } from "../fish-data";

export class FishBuyCommand implements Command {
	public get name(): string {
		return "낚시구매";
	}

	public get alias(): string[] {
		return ["ㄱㅁ", "bu"];
	}

	public get description(): string {
		return "무엇을 사러 시장에 갈까나 (번호는 낚시상점 목록을 참고하세요!)";
	}

	public get usage(): string {
		return "<타입 (낚싯대 | 미끼 | 칭호)> <번호> <개수>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo, commandManager: CommandManager): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const args = info.message.split(" ").slice(1);
		if (args.length < 3 || !["낚싯대", "미끼", "칭호"].includes(args[0]) || (isNaN(parseInt(args[1])) && isNaN(parseInt(args[2]))))
			return info.replier.reply("[ " + this.usage + " 식으로 입력해주세요! ]");

		const type = args[0];
		const index = parseInt(args[1]);
		const count = parseInt(args[2]);
		if (index < 0 || count < 0) return info.replier.reply("[ 음수는 입력할 수 없어요! ]");

		const targets = (type === "낚싯대" ? FishUtils.FISH_DATABASE.lastData.rods : type === "미끼" ? FishUtils.FISH_DATABASE.lastData.baits : FishUtils.FISH_DATABASE.lastData.tags).sort((a, b) =>
			a.name.localeCompare(b.name)
		);

		const target = targets[index];
		if (!target || target.price === -1) return info.replier.reply("[ 존재하지 않는 아이템이에요! ]");
		const price = target.price * count;
		if (user.money < price) return info.replier.reply("[ 돈이 부족해요! ]");

		const isOkay = await commandManager.ask(info, `[ ${FishUtils.getUserName(user)}님, ${target.name} 아이템을 ${count}개 만큼 구매하시겠습니까? (Y | N)\n   - 총 가격: ${price} ]`).get();
		if (!["Y", "YES", "예", "네", "ㅇㅇ"].includes(isOkay.toUpperCase())) return info.replier.reply(`[ ${FishUtils.getUserName(user)}님, 구매가 취소되었어요, 다시 구매를 진행해주세요! ]`);

		user.money -= price;
		if (type === "낚싯대") user.rods.push(...Array(count).fill(target));
		else if (type === "미끼") user.baits.push(...Array(count).fill(target));
		else if (type === "칭호") user.tags.push(...Array(count).fill(target));

		info.replier.reply(`[ ${FishUtils.getUserName(user)}님, ${target.name} 아이템을 ${count}개 만큼 구매하였어요!\n - ${price}원 소비\n - 현재 잔고: ${user.money} ]`);
	}
}
