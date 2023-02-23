const gameManagerStatus = {
	SUCCESS: "성공",
	ALREADY_EXISTS_NAME: "이미 존재하는 방 이름입니다.",
	ALREADY_JOINED: "이미 다른 방에 참여하고 있습니다.",
	UNKNOWN_GAME_TYPE: "알 수 없는 게임 타입입니다.",
	DOES_NOT_EXIST: "존재하지 않는 방입니다.",
	NOT_ONE_TO_ONE: "1:1 채팅방에서만 생성할 수 있습니다.",
	GAME_PLAYING: "게임이 진행중입니다.",
	GAME_FULL: "게임이 가득 찼습니다.",
	MASTER_CHANGED: "방장이 변경되었습니다.",
	GAME_REMOVED: "방이 삭제되었습니다."
};

export const GAME_MANAGER_STATUS = Object.keys(gameManagerStatus).reduce((acc, key, i) => {
	acc[i] = gameManagerStatus[key];
	return acc;
}, {});
