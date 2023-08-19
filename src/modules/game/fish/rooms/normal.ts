import { FishingRoom } from "../fish-data";
import { COD_FISH, GOOFY_FISH, MACKEREL_FISH, STURGEON_FISH, TRASH_FISH } from "../fishes";

export const NORMAL_RIVER_FISHROOM: FishingRoom = {
	id: "DEFAULT",
	name: "평범한 강가 - 어딘지 모름",
	fishIds: [
		GOOFY_FISH,
		GOOFY_FISH,
		GOOFY_FISH,
		GOOFY_FISH,
		GOOFY_FISH,
		MACKEREL_FISH,
		MACKEREL_FISH,
		TRASH_FISH,
		TRASH_FISH,
		TRASH_FISH,
		TRASH_FISH,
		TRASH_FISH,
		STURGEON_FISH,
		COD_FISH,
		COD_FISH
	].map((e) => e.id),
	requiredLevel: 1
};
