//requiring npm packages
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const glob = require("glob");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const app = express();
/** Create HTTP server. */
const server = http.createServer(app);
const socketio = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});;
const WebSockets = require("./src/components/chat/utils/webSockets");

//setting path for env variables and PORT
dotenv.config({ path: __dirname + "/.env" });
const PORT = process.env.PORT || 8080;

//cross origin resourse sharing (Enable all cors requests here)
app.use(cors());

//establish connection with db
require("./src/db/mongoose");

//log requests
app.use(morgan("tiny"));

//parse request to body parser
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//update limit of recieving json data
app.use(express.json({ limit: "50mb" }));

//load routes
app.use(express.json());
let webRoutes = "**/*.routes.js";

//looping on each route and requiring in our app
glob.sync(webRoutes).forEach((file) => {
	let router = require("./" + file);
	app.use(router);
	console.log(file + " is loaded");
});

//error handling
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		error: {
			message: error.message,
		},
	});
	next();
});

/** Create socket connection */
global.io = socketio
global.io.on("connection", WebSockets.connection);
//global.io.on('connection', (socket) => console.log("connected"))
//checking connection established with db
server.listen(PORT, () => console.log("server is on port : " + PORT));
