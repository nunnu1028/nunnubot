import { KakaoApiService, KakaoLinkClient, TemplateBuilder } from "kakaolink";
import { BOT_FOLDER_PATH, DatabaseManager, notificationListener } from "nunnu-module";

interface SecretInfo {
	kakaoLink: {
		email: string;
		password: string;
		key: string;
		url: string;
	};
}

const kakaoLinkClient = new KakaoLinkClient();
const secretInfo: SecretInfo = new DatabaseManager(BOT_FOLDER_PATH + "/secret.json", JSON.parse, JSON.stringify).load();

function init(): void {
	const loginKakaoLink = () => {
		KakaoApiService.createService()
			.login({
				email: secretInfo.kakaoLink.email,
				password: secretInfo.kakaoLink.password,
				keepLogin: true
			})
			.then((e) => {
				kakaoLinkClient.login(e, {
					apiKey: secretInfo.kakaoLink.key,
					url: secretInfo.kakaoLink.url
				});
			})
			.catch((e) => {
				throw e;
			});
	};

	loginKakaoLink();
}

// Production
function onMessage(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId?: string): void {
	if (message === "!test") {
		replier.reply("hi");
		const res = kakaoLinkClient.sendLink(
			room,
			TemplateBuilder.newDefaultBuilder()
				.setTypeAsFeed()
				.setContent(
					TemplateBuilder.newContentBuilder()
						.setImageUrl("https://ppss.kr/wp-content/uploads/2017/08/MC_SightWords-Some.jpg")
						.setTitle("hi")
						.setLink({
							webUrl: "https://www.naver.com",
							mobileWebUrl: "https://www.naver.com"
						})
						.build()
				)
				.build()
		);
		res.catch((data) => {
			replier.reply(data);
		});
	}
}

// DebugRoom
function response(room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string): void {
	if (packageName !== "com.xfl.msgbot") return;
}

init();
var onNotificationPosted = notificationListener;
