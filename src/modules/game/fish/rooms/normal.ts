import { FishingRoom } from "../fish-data";
import { GOOFY_FISH } from "../fishes";

export const NORMAL_RIVER_FISHROOM: FishingRoom = {
	id: "DEFAULT",
	name: "평범한 강가",
	fishIds: [GOOFY_FISH].map((e) => e.id),
	requiredLevel: 1
};
