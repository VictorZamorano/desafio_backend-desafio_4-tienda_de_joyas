import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import myRouter from "./routes/route.js";

const app = express();

app.use(express.json());
app.use("/", myRouter);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log("SERVER ON", "http://localhost:" + PORT + "/joyas");
});
