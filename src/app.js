require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5001;
const mongoose = require("./db/mongoose");
const User = require("./models/users");

app.get("/", (req, res) => {
	res.send("Hello from Kapil");
	// User.
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

		user.save().then(() => {
			const token = user.generateAuthToken();
			res.status(200).send(user);
			console.log("token", token);
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
				console.log("user found", user);
				user.comparePassword(password, function (err, isMatch) {
					if (isMatch) {
						const token = user.generateAuthToken();
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

const createToken = () => {
	const token = jwt.sign(
		{ _id: "asdfjkalsdfjlkdsa" },
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: "1 minute",
		}
	);
	const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
	console.log("token", token, verifiedUser);
};
// createToken();

app.listen(port, () => {
	console.log(`connected on port ${port} `);
});
