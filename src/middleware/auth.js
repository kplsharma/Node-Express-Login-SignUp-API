const jwt = require("jsonwebtoken");
const User = require("../models/users");
const auth = async (req, res, next) => {
	try {
		const token = req.cookies.authToken;
		const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (verifyUser) {
			const userId = verifyUser._id;
			const user = await User.findOne({ _id: userId });
			const isTokenIsInDB = user.tokens.filter((t) => t.token == token);
			if (isTokenIsInDB.length) {
				req.token = token;
				req.user = user;
				next();
			} else {
				res.sendStatus(401);
			}
		} else {
			res.sendStatus(401);
		}
	} catch (error) {
		res.sendStatus(401);
	}
};

module.exports = auth;
