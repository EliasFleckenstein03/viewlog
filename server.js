const fs = require("fs");
const http = require("http");

const config = JSON.parse(fs.readFileSync("config.json"));

if (! config) {
	console.log("Error in Config file!");
	process.exit(1);
}
