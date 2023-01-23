const fs = require("fs");
const botName = "bot";

const indexFileData = fs.readFileSync("./dist/index.js", "utf8");
const editedFileData = indexFileData.replace(`Object.defineProperty(exports, "__esModule", { value: true });\r\n`, "");

fs.writeFileSync("./dist/index.js", editedFileData, "utf8");

const runOSCommand = (command) => {
	const { execSync } = require("child_process");
	execSync(command, { stdio: "inherit" });
};

runOSCommand(`adb push ./dist/index.js /sdcard/msgbot/Bots/${botName}/index.js`);
runOSCommand(`adb push ./dist/modules /sdcard/msgbot/Bots/${botName}/`);

const forCompiler = parseInt(fs.readFileSync("./src/forCompiler.txt", "utf8"));
fs.writeFileSync("./src/forCompiler.txt", (forCompiler + 1).toString(), "utf8");

runOSCommand(`adb push ./src/forCompiler.txt /sdcard/msgbot/Bots/${botName}/forCompiler.txt`);

console.log("after build finished.");
