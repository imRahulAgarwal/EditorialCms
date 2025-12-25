import mongoose from "mongoose";

export default async function connectDatabase() {
	const mongoUrl = process.env.MONGO_URL as string;
	if (mongoose.connection.readyState === 1) {
		return;
	}

	await mongoose.connect(mongoUrl);
}
