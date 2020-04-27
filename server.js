const fs = require("fs");
const http = require("http");

const config = JSON.parse(fs.readFileSync("config.json"));

let sessions = [];

http.createServer((request, response) => {
	let data = null;
	request.on("data", str => {
		data = new Buffer(str, 'ascii').toString('utf8');
	});
	request.on("end", _ => {
		switch (request.url) {
			case "/":
				fs.readFile("index.html", (error, data) => {
					if (error) {
						response.setHeader("Content-type", "text/plain");
						response.statusCode = 500;
						response.end("Internal Server Error");
					}
					else {
						response.setHeader("Content-type", "text/html");
						response.statusCode = 200;
						response.end(data);
					}
				});
				break;
			case "/client":
				fs.readFile("client.js", (error, data) => {
					if (error) {
						response.setHeader("Content-type", "text/plain");
						response.statusCode = 500;
						response.end("Internal Server Error");
					}
					else {
						response.setHeader("Content-type", "text/javascript");
						response.statusCode = 200;
						response.end(data);
					}
				});
				break;
			case "/login":
				response.setHeader("Content-type", "text/plain");
				if (data == config.password) {
					response.statusCode = 200;
					let ssid = null;
					do
						ssid = Math.random().toString().replace("0.", "#");
					while (sessions.indexOf(ssid) != -1);
					sessions.push(ssid);
					response.end(ssid);
				}
				else {
					response.statusCode = 401;
					response.end("Invalid Password");
				}
				break;
			case "/logout":
				response.setHeader("Content-type", "text/plain");
				if (sessions.indexOf(data) != -1) {
					sessions = sessions.filter(entry => { return entry != data; });
					response.statusCode = 200;
					response.end("Success");
				}
				else {
					response.statusCode = 401;
					response.end("Not logged in");
				}
				break;
			case "/data":
				response.setHeader("Content-type", "text/plain");
				if (sessions.indexOf(data) != -1) {
					response.setHeader("Content-type", "text/plain");
					fs.readFile(config.file, (error, data) => {
						if (error) {
							response.statusCode = 500;
							response.end("Internal Server Error");
						}
						else {
							response.statusCode = 200;
							response.end(data);
						}
					});
				}
				else {
					response.statusCode = 401;
					response.end("Not logged in");
				}
				break;
			default:
				response.setHeader("Content-type", "text/plain");
				response.statusCode = 404;
				response.end("Not found");
				break;
		}
	});
}).listen(config.port);
