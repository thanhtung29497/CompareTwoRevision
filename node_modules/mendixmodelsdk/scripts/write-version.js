const fs = require("fs");

const opts = { encoding: "utf8" };

const packageJSON = JSON.parse(fs.readFileSync(__dirname + "/../package.json"), opts);
const versionStr = packageJSON.version;

const versionTsContents =
	"/** Current SDK version: " + versionStr + " */\n"
	+ "export const SDK_VERSION: string = \"" + versionStr.replace(/-.*$/, "") + "\";\n";
fs.writeFileSync("src/version.ts", versionTsContents, opts);

