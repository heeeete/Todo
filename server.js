const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
	user: "root",
	host: "127.0.0.1",
	password: "981126",
	database: "rememberbooks",
});

app.listen(3001, () => {
	console.log("Your server is running on port 3001");
});

app.post("/addrememberbook", (req, res) => {
	const user = req.body.user;
	const title = req.body.title;
	const review = req.body.review;

	db.query(
		"INSERT INTO rememberbooks.rememberbook (user,title,review) VALUES (?,?,?)",
		[user, title, review],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send("Inserted values successfully!");
			}
		}
	);
});
