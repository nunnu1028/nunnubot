const fs = require("fs");
const botName = "bot";

const runOSCommand = (command) => {
	const { execSync } = require("child_process");
	execSync(command, { stdio: "inherit" });
};

function afterBuild() {
	const indexFileData = fs.readFileSync("./dist/index.js", "utf8");
	const editedFileData = indexFileData.replace(`Object.defineProperty(exports, "__esModule", { value: true });\r\n`, "");
	fs.writeFileSync("./dist/index.js", editedFileData, "utf8");

	runOSCommand(`adb push ./dist/index.js /sdcard/msgbot/Bots/${botName}/${botName}.js`);
	runOSCommand(`adb push ./dist/modules /sdcard/msgbot/Bots/${botName}/`);

	const compiledCount = JSON.parse(fs.readFileSync("./src/data/compiledCount.json", "utf8"));
	fs.writeFileSync("./src/data/compiledCount.json", JSON.stringify({ count: compiledCount.count + 1 }), "utf8");
	runOSCommand(`adb push ./src/data /sdcard/msgbot/Bots/${botName}/`);
	runOSCommand("adb shell am broadcast -a com.xfl.msgbot.broadcast.compile -p com.xfl.msgbot --es name Bot");
	runOSCommand("adb shell am broadcast -a com.xfl.msgbot.broadcast.set_bot_power -p com.xfl.msgbot --es name Bot --ez power true");
	console.log("after build finished.");
}

afterBuild();
