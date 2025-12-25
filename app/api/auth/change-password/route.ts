import connectDatabase from "@/lib/configs/connectDatabase";
import UserModel from "@/lib/models/user";
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

		const { currentPassword, newPassword, confirmPassword } = body;
		if (newPassword !== confirmPassword) {
			return NextResponse.json({ success: false, error: "Passwords are not same." }, { status: 400 });
		}

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
