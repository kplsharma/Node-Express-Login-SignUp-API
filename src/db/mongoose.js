const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
	.connect("mongodb://localhost:27017/support", {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB is connected");
	})
	.catch((error) => {
		console.log("DB error", error);
	});

module.exports = mongoose;
