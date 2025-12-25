import { IUser } from "@/interfaces/User";
import { Schema, model, models, UpdateQuery } from "mongoose";

const userSchema = new Schema(
	{
		fName: String,
		lName: String,
		fullName: String,
		username: String,
		email: String,
		role: { type: String, enum: ["super_admin", "admin", "editor", "viewer"], default: "viewer" },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		password: { type: String, select: false },
		passwordChangedAt: Date,
		passwordResettedAt: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", function () {
	this.fullName = `${this.fName} ${this.lName}`;
});

userSchema.pre("findOneAndUpdate", function () {
	const update = this.getUpdate() as UpdateQuery<IUser> | undefined;

	if (!update) {
		return;
	}

	const fName = update.fName || update.$set?.fName;
	const lName = update.lName || update.$set?.lName;

	if (fName || lName) {
		this.setUpdate({
			...update,
			$set: {
				...update.$set,
				fullName: `${fName ?? ""} ${lName ?? ""}`.trim(),
			},
		});
	}
});

const UserModel = models.users || model("users", userSchema);

export default UserModel;
