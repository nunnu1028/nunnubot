import { MessageInfo, CommandManager, FunctionResult } from "core";
import { BangCharacter, BangGame, BangPlayer, BangResult } from "game";

export class GlobalChar implements BangCharacter {
	public name = "_why u see this?";
	public description = "_don't see this plz bro";
	public maxHealth = 0;

	public checkUseBang(player: BangPlayer): FunctionResult {
		return player.items.find((e) => e.name === "빗나감") ? { success: true, status: BangResult.SUCCESS } : { success: false, status: BangResult.NO_ITEM };
	}

	public checkBang(isByTwo: boolean, player: BangPlayer, game: BangGame, info: MessageInfo, manager: CommandManager): FunctionResult {
		if (isByTwo ? player.items.filter((e) => e.name === "빗나감").length >= 2 : player.items.find((e) => e.name === "빗나감")) {
			let finalAsk = manager.ask(info, `빗나감을 사용할 수 있습니다. ${isByTwo && "(두개를 사용해야 합니다.)"} y/n`).get();
			if (finalAsk !== "y") finalAsk = manager.ask(info, "정말 사용하지 않으시겠습니까? y/n").get();
			if (finalAsk !== "y") return { success: false, status: BangResult.NONE };

			player.items.splice(
				player.items.findIndex((e) => e.name === "빗나감"),
				isByTwo ? 2 : 1
			);

			info.replier.reply(`빗나감을 사용했습니다. ${isByTwo && "(두개를 사용했습니다.)"}`);

			return { success: true, status: isByTwo ? BangResult.USED_MISS_TWO : BangResult.USED_MISS };
		}

		return { success: false, status: BangResult.NO_ITEM };
	}
}
