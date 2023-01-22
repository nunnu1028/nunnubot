const fs = require("fs");

const indexFileData = require("fs").readFileSync("./dist/index.js", "utf8");
const editedFileData = indexFileData.replace(`Object.defineProperty(exports, "__esModule", { value: true });\r\n`, "");

fs.writeFileSync("./dist/index.js", editedFileData, "utf8");

const runOSCommand = (command) => {
	const { execSync } = require("child_process");
	execSync(command, { stdio: "inherit" });
};

runOSCommand("adb push ./dist/index.js /sdcard/msgbot/Bots/bot/index.js");
runOSCommand("adb push ./dist/modules /sdcard/msgbot/Bots/bot/");

console.log("after build finished.");
