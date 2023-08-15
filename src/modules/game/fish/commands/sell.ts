import { CheckLevelRes, Command, CommandManager, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";
import { Fish, Rod } from "../fish-data";

export class FishSellCommand implements Command {
	public get name(): string {
		return "낚시판매";
	}

	public get alias(): string[] {
		return ["ㅍ", "sell"];
	}

	public get description(): string {
		return "내가 잡은거 팔 수도 있지";
	}

	public get usage(): string {
		return "<타입 (물고기 | 낚싯대) <번호 (숫자 | 전부)>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo, commandManager: CommandManager): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const args = info.message.split(" ").slice(1);
		if (args.length < 2 || !["물고기", "낚싯대"].includes(args[0]) || (args[1] !== "전부" && isNaN(parseInt(args[1])))) return info.replier.reply("[ " + this.usage + " 식으로 입력해주세요! ]");

		const type = args[0];
		if (args[1] !== "전부") {
			const index = parseInt(args[1]);
			const target = type === "물고기" ? user.fishes[index] : user.rods[index] ? user.rods[index] : null;
			if (!target) return info.replier.reply("[ 해당 번호의 물고기/낚싯대가 없어요! ]");
			if (target.price === -1) return info.replier.reply("[ 해당 물고기/낚싯대는 판매할 수 없어요! ]");
			if (args[1] === "낚싯대" && index === user.selectedRodIndex) return info.replier.reply("[ 장착중인 낚싯대는 판매할 수 없어요! ]");

			const isOkay = await commandManager
				.ask(
					info,
					`[ 아래 ${type}를 판매하시겠습니까? (Y or N) ]${"\u200b".repeat(500)}\n\n${(type === "물고기"
						? [`${target.name} - ${target.description}`, `	등급: ${(target as Fish).level}`, `	길이: ${(target as Fish).length}cm`, `	가격: ${target.price}원`]
						: [`${target.name} - ${target.description}`, `	가격: ${target.price === -1 ? "구매&판매 불가" : `${target.price}원`}`]
					).join("\n")}`
				)
				.get();

			if (!["Y", "YES", "예", "네", "ㅇㅇ"].includes(isOkay.toUpperCase())) return info.replier.reply("[ 판매가 취소되었어요! ]");

			user.money += target.price;
			if (type === "물고기") user.fishes.splice(index, 1);
			else user.rods.splice(index, 1);

			return info.replier.reply(`[ ${FishUtils.getUserName(user)}님, 판매가 완료되었어요! ]\n\n	판매한 ${type}의 가격: ${target.price}원\n	현재 잔액: ${user.money}원`);
		}

		const targets = (
			(type === "물고기" ? user.fishes : user.rods) as {
				price: number;
			}[]
		).filter((e) => e.price != -1) as Fish[] | Rod[];

		if (targets.length === 0) return info.replier.reply("[ 판매할 수 있는 물고기/낚싯대가 없어요! ]");

		const isOkay = await commandManager
			.ask(
				info,
				`[ 아래 ${type}들을 판매하시겠습니까? (Y or N) ]${"\u200b".repeat(500)}\n\n${(type === "물고기"
					? targets.map((e) => [`${e.name} - ${e.description}`, `	등급: ${(e as Fish).level}`, `	길이: ${(e as Fish).length}cm`, `	가격: ${e.price}원\n`].join("\n"))
					: targets.map((e) => [`${e.name} - ${e.description}`, `	가격: ${e.price === -1 ? "구매&판매 불가" : `${e.price}원`}\n`].join("\n"))
				).join("\n")}`
			)
			.get();

		if (!["Y", "YES", "예", "네", "ㅇㅇ"].includes(isOkay.toUpperCase())) return info.replier.reply("[ 판매가 취소되었어요! ]");

		const price = (targets as { price: number }[]).reduce((a, b) => a + b.price, 0);
		user.money += price;
		if (type === "물고기") user.fishes = user.fishes.filter((e) => e.price === -1);
		else user.rods = user.rods.filter((e) => e.price === -1);

		return info.replier.reply(`[ ${FishUtils.getUserName(user)}님, 판매가 완료되었어요! ]\n\n	판매한 ${type}들의 가격: ${price}원\n	현재 잔액: ${user.money}원`);
	}
}
