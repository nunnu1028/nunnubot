import { FishingRoom } from "../fish-data";
import { MACKEREL_FISH } from "../fishes";

export const HAN_RIVER_FISHROOM: FishingRoom = {
	id: "han",
	name: "한강",
	fishIds: [MACKEREL_FISH].map((e) => e.id),
	requiredLevel: 7
};
