import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishChangeRodCommand implements Command {
	public get name(): string {
		return "낚싯대변경";
	}

	public get alias(): string[] {
		return ["ㄴㅂ", "cr"];
	}

	public get description(): string {
		return "낚싯대가 부러져브럿어";
	}

	public get usage(): string {
		return "<낚싯대 번호>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const args = info.message.split(" ").slice(1);
		if (!args[0] || isNaN(parseInt(args[0]))) return info.replier.reply("[ 낚싯대 번호를 입력해주세요! ]");

		const tag = user.selectedTagId ? FishUtils.FISH_DATABASE.lastData.tags.find((e) => e.id === user.selectedTagId) : null;
		if (!user.rodIds[parseInt(args[0])]) return info.replier.reply("[ 해당 낚싯대는 존재하지 않아요! ]");
		if (user.selectedRodId === user.rodIds[parseInt(args[0])]) return info.replier.reply("[ 이미 해당 낚싯대를 장착하고 있어요! ]");

		const rod = FishUtils.FISH_DATABASE.lastData.rods.find((e) => e.id === user.rodIds[parseInt(args[0])]);
		user.selectedRodId = rod!.id;
		FishUtils.FISH_DATABASE.save(FishUtils.FISH_DATABASE.lastData);

		info.replier.reply(`[ ${user.name}${tag ? ` [${tag.name}]` : ""}님의 낚싯대 변경 ]\n${rod!.name} 낚싯대로 변경되었어요!`);
	}
}
