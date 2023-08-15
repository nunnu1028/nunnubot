import { FishingRoom } from "../fish-data";
import { GOOFY_FISH, MACKEREL_FISH, SALMON_FISH, TRASH_FISH } from "../fishes";

export const HAN_RIVER_FISHROOM: FishingRoom = {
	id: "han",
	name: "한강",
	fishIds: [GOOFY_FISH, MACKEREL_FISH, SALMON_FISH, TRASH_FISH, TRASH_FISH].map((e) => e.id),
	requiredLevel: 7
};
