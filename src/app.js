require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5001;
const mongoose = require("./database/mongoose");
const User = require("./models/users");
const auth = require("./middleware/auth");

if (process.env.PORT) {
	console.log("port It is set!");
} else {
	console.log("port is not set!", process.env.PORT);
}

app.get("/", (req, res) => {
	res.send("Hello from Kapil, CI/CD Test");
});

app.get("/dashboard", auth, (req, res) => {
	res.send("Hello this is dashboard secret page");
});

app.get("/logout", auth, async (req, res) => {
	req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
	//req.user.tokens = []; //all device logout
	await req.user.save();
	res.clearCookie("authToken");
	res.send("logout");
});

app.post("/register", (req, res) => {
	const {
		userName,
		firstName,
		midName,
		lastName,
		displayName,
		email,
		dob,
		country,
		rank,
		score,
		event,
		password,
	} = req.body;

	try {
		const user = new User({
			userName,
			firstName,
			midName,
			lastName,
			displayName,
			email,
			dob,
			country,
			rank,
			score,
			event,
			password,
		});

		user.save()
			.then(() => {
				const token = user.generateAuthToken();
				res.cookie("authToken", token);
				res.status(200).send(user);
				// console.log("token", token);
			})
			.catch((error) => {
				console.log("error while saving user");
				res.status(400).send("error");
			});
	} catch (error) {
		res.status(400).send(error);
	}
});

app.post("/login", (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then((user) => {
			if (user) {
				// console.log("user found");
				user.comparePassword(password, function (err, isMatch) {
					if (isMatch) {
						const token = user.generateAuthToken();
						res.cookie("authToken", token, {
							expires: new Date(Date.now() + 360000),
							httpOnly: true,
							// secure: true, //https only
						});
						res.status(200).send({
							success: true,
							message: "user found",
						});
					} else {
						res.status(400).send({ success: false, message: "" });
					}
				});
			} else {
				res.status(400).send({
					success: false,
					message: "details not match",
				});
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(400).send(error);
		});
});

app.listen(port, () => {
	console.log(`connected on port ${port} `);
});
