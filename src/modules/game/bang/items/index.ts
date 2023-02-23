import { MessageInfo, CommandManager } from "core";
import { BangGame, BangItem, BangPageType, BangPlayer } from "../bang-game";

export class BangItem_Bang implements BangItem {
	public name = "뱅";
	public description = "빵야빵야!";
	public usage = ["b", "타겟"];

	public execute(player: BangPlayer, game: BangGame, info: MessageInfo, manager: CommandManager): void {
		const args = info.message.split(" ").slice(1);

		if (args.length < 1) return info.replier.reply("사용법: " + this.usage);
		const target = Array.from(game.players.values()).find((p) => p.name === args[0]);

		if (!target) return info.replier.reply("타겟을 찾을 수 없습니다.");
		if (target.isDead) return info.replier.reply("이미 죽은 사람입니다.");
		if (target === player) return info.replier.reply("자기 자신을 뱅할 수 없습니다.");

		const allPlayers: BangPlayer[] = Array.from(game.players.values());
		const page1Res = target.character.execute(BangPageType.BANGED, target, game, info, manager);

		if (page1Res.success) {
			game.players.forEach((p) => {
				const text = p === target ? `당신은 ${player.name}에게 뱅당했습니다.` : `${player.name}이 ${target.name}에게 뱅을 쏘았습니다.`;
				p.replier.reply(text);
			});
		}
	}
}
