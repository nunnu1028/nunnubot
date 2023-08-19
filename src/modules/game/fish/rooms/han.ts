import { FishingRoom } from "../fish-data";
import { COD_FISH, GOOFY_FISH, MACKEREL_FISH, SALMON_FISH, TRASH_FISH } from "../fishes";

export const HAN_RIVER_FISHROOM: FishingRoom = {
	id: "han",
	name: "한강 - 대한민국",
	fishIds: [GOOFY_FISH, GOOFY_FISH, GOOFY_FISH, GOOFY_FISH, MACKEREL_FISH, SALMON_FISH, TRASH_FISH, TRASH_FISH, TRASH_FISH, TRASH_FISH, TRASH_FISH, TRASH_FISH, COD_FISH, COD_FISH].map((e) => e.id),
	requiredLevel: 10
};
