import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import connectDatabase from "@/lib/configs/connectDatabase";
import { checkRoleAccess } from "@/lib/middlewares/authMiddleware";
import { TRoute } from "@/types/Route";

export const GET = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		await connectDatabase();
		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		return NextResponse.json({ success: true, user });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const PUT = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		await connectDatabase();
		const body = await req.json();

		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		let username = user.username;
		if (user.fName !== body.fName || user.lName !== body.lName) {
			const randomNo = Math.floor(Math.random() * 9000) + 1000;
			username = `${body.fName}.${body.lName}.${randomNo}`;
		}

		await UserModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { ...body, username } }, { new: true });
		return NextResponse.json({ success: true, message: "User details updated successfully." }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const DELETE = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		await connectDatabase();
		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		user.isDeleted = true;
		await user.save();

		return NextResponse.json({ success: true, message: "User details removed successfully." }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
