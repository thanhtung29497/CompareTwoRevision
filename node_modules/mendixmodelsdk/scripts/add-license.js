const fs = require("fs");

const distFilePath = "dist/index.js";
const distFileTypingsPath = "dist/index.d.ts";

const opts = { encoding: "utf8" };
const licenseContents = fs.readFileSync(__dirname + "/../LICENSE", opts);

fs.writeFileSync(
	distFilePath,
	"/*\n" + licenseContents + "*/\n\n" + fs.readFileSync(distFilePath, "utf8"),
	"utf8"
);
fs.writeFileSync(
	distFileTypingsPath,
	"/*\n" + licenseContents + "*/\n\n" + fs.readFileSync(distFileTypingsPath, "utf8"),
	"utf8"
);

