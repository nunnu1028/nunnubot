import { CheckLevelRes, Command, MessageInfo } from "core";
import { FishUtils } from "../fish-utils";

export class FishMoveCommand implements Command {
	public get name(): string {
		return "낚시이동";
	}

	public get alias(): string[] {
		return ["ㅇㄷ", "fm"];
	}

	public get description(): string {
		return "고기를 잡으러 갈곳을 정해보자";
	}

	public get usage(): string {
		return "<방이름>";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public async execute(info: MessageInfo): Promise<void> {
		if (!FishUtils.FISH_DATABASE) FishUtils.initDatabase();
		const user = FishUtils.FISH_DATABASE.lastData.users.find((e) => e.id === info.hashedUserId);
		if (!user) return info.replier.reply("[ 낚시 게임에 가입하지 않았어요. 낚시가입 혹은 fr 을 입력해주세요! ]");

		const roomName = info.message.split(" ").slice(1).join(" ");
		if (!roomName) return info.replier.reply("[ 낚싯터 이름을 입력해주세요! ]");

		const roomInfo = FishUtils.FISH_DATABASE.lastData.rooms.find((e) => e.name === roomName);
		if (!roomInfo) return info.replier.reply("[ 낚싯터를 찾을 수 없어요! 다시 확인해줄래요? ]");
		if (user.currentRoomId === roomInfo.id) return info.replier.reply("[ 이미 그 낚싯터에 있어요! ]");
		if (user.currentLevel < roomInfo.requiredLevel) return info.replier.reply("[ 그 낚싯터에 들어가기에는 레벨이 부족해요! ]");

		user.currentRoomId = roomInfo.id;

		info.replier.reply(`[ 낚싯터 이동이 완료되었어요!\n  현재 계신 낚싯터 이름은 ${roomInfo.name} 이에요! ]`);
	}
}
