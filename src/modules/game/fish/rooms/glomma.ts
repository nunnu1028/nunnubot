import { FishingRoom } from "../fish-data";
import { GOOFY_FISH, SALMON_FISH, TRASH_FISH } from "../fishes";

export const GLOMMA_RIVER_FISHROOM: FishingRoom = {
	id: "GLOMMA",
	name: "글롬마 강 - 노르웨이",
	fishIds: [SALMON_FISH, GOOFY_FISH, GOOFY_FISH, TRASH_FISH].map((e) => e.id),
	requiredLevel: 20
};
