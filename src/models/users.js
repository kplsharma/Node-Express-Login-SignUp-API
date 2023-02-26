const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"),
	SALT_WORK_FACTOR = 10;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	userName: {
		type: String,
	},
	firstName: {
		type: String,
	},
	midName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	displayName: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		index: { unique: true },
	},
	password: {
		type: String,
		required: true,
	},
	dob: { type: String },
	country: { type: String },
	rank: { type: String },
	score: { type: String },
	event: {
		type: String,
		default: "100m",
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
	isEmailVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
});

UserSchema.pre("save", function (next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.generateAuthToken = function () {
	const user = this;
	try {
		const token = jwt.sign(
			{ _id: user._id.toString() },
			process.env.JWT_SECRET_KEY
		);
		this.tokens = this.tokens.concat({ token: token });
		//.push({ token }); // =
		this.save();
		return token;
	} catch (error) {
		// res.send("error token");
		console.log(error);
	}
};

/* UserSchema.pre("save", function (next) {
    const user = this;
    if(!user.isModified('password')) return next();
	if (this.isModified("password")) {
		// this.password = bcrypt.hash(this.password, 10);
		bcrypt
			.hash(this.password, 10)
			.then((pass) => {
				this.password = pass;
				next();
			})
			.catch((error) => {
				console.log(error);
			});
	}
	// next();
}); */

//this is new collection;
const User = mongoose.model("User", UserSchema);
module.exports = User;
