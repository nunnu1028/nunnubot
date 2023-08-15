import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishChangeTagCommand implements Command {
	public get name(): string {
		return "칭호변경";
	}

	public get alias(): string[] {
		return ["ㅊㅂ", "ct"];
	}

	public get description(): string {
		return "칭호를 바꿔보자";
	}

	public get usage(): string {
		return "<칭호 번호>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const args = info.message.split(" ").slice(1);
		if (!args[0] || isNaN(parseInt(args[0]))) return info.replier.reply("[ 칭호 번호를 입력해주세요! ]");

		if (!user.tags[parseInt(args[0])]) return info.replier.reply("[ 해당 칭호는 존재하지 않아요! ]");
		if (user.selectedTagIndex === parseInt(args[0])) return info.replier.reply("[ 이미 해당 칭호를 장착하고 있어요! ]");

		const tag = user.tags[parseInt(args[0])];
		user.selectedTagIndex = parseInt(args[0]);

		info.replier.reply(`${FishUtils.getUserName(user)}님의 낚싯대 변경 ]\n${tag!.name}로 변경되었어요!`);
	}
}
