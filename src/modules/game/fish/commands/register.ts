import { CheckLevelRes, Command, CommandManager, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishRegisterCommand implements Command {
	public get name(): string {
		return "낚시가입";
	}

	public get alias(): string[] {
		return ["fr"];
	}

	public get description(): string {
		return "근데 고기 잡으러 바다갈려면, 낚싯대를 구해야 하잖아.";
	}

	public get usage(): string {
		return "";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo, commandManager: CommandManager): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();

		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (user) return info.replier.reply("이미 낚시 게임에 가입을 하셨어요!");

		const userName = await (async () => {
			let lastName = "";

			while (true) {
				lastName = await commandManager.ask(info, "낚시 게임에 가입할 닉네임을 입력해주세요!").get();

				if (FishUtils.FISH_DATABASE.lastData.users.some((e) => e.name === lastName)) {
					info.replier.reply("이미 존재하는 닉네임이에요, 다시 한번 입력해줄래요?");
					continue;
				}

				break;
			}

			return lastName;
		})();

		const isOkay = await commandManager.ask(info, userName + " 으로 가입하시겠습니까? (Y or N)").get();

		if (!["Y", "YES", "예", "네", "ㅇㅇ"].includes(isOkay.toUpperCase())) return info.replier.reply("가입이 취소되었어요, 다시 가입을 진행해주세요!");

		FishUtils.FISH_DATABASE.lastData.users.push({
			...FishUtils.getDefaultUserData(userName),
			id: info.hashedUserId
		});

		FishUtils.FISH_DATABASE.save(FishUtils.FISH_DATABASE.lastData);

		info.replier.reply(`낚시 게임에 가입이 완료되었어요!\n	이름: ${userName}\n	낚시 혹은 ㄴㅅ를 입력해 게임을 시작해보세요!`);
	}
}
