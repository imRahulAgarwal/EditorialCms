import connectDatabase from "@/lib/configs/connectDatabase";
import UserModel from "@/lib/models/user";
import { changePasswordSchema } from "@/lib/schemas/auth";
import { comparePassword, hashPassword } from "@/lib/utils/passwordUtil";
import { verifyToken } from "@/lib/utils/tokenUtil";
import { UpdateQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	try {
		const token = req.cookies.get("token")?.value as string;
		const payload = verifyToken(token);
		const id = payload.id;

		await connectDatabase();
		const body = await req.json();

		const validation = changePasswordSchema.validate(body);
		if (validation.error) {
			const errors = validation.error.details.map((issue) => issue.message);
			return NextResponse.json({ success: false, error: errors[0] }, { status: 422 });
		}

		const { currentPassword, newPassword } = validation.value;
		const user = await UserModel.findOne({ _id: id, isDeleted: false, isActive: true }).select("+password");
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		const isValidPassword = await comparePassword(user.password, currentPassword);
		if (!isValidPassword) {
			return NextResponse.json({ success: false, error: "Invalid current password." }, { status: 401 });
		}

		const hashedPassword = await hashPassword(newPassword);
		const updateQuery: UpdateQuery<unknown> = { $set: { password: hashedPassword, passwordChangedAt: new Date() } };
		if (user.requiresPasswordChange) {
			updateQuery.$unset = { requiresPasswordChange: 1 };
		}

		await UserModel.findOneAndUpdate({ _id: id, isDeleted: false, isActive: true }, updateQuery, { new: true });

		return NextResponse.json({ success: true, message: "Password changed successfully." }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
