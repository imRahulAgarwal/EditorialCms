import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import connectDatabase from "@/lib/configs/connectDatabase";
import { checkRoleAccess } from "@/lib/middlewares/authMiddleware";
import { TRoute } from "@/types/Route";
import userSchema from "@/lib/schemas/user";
import validateObjectId from "@/lib/schemas/objectId";

export const GET = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

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
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

		await connectDatabase();
		const body = await req.json();
		const validation = userSchema.validate(body);
		if (validation.error) {
			const errors = validation.error.details.map((issue) => issue.message);
			return NextResponse.json({ success: false, error: errors[0] }, { status: 422 });
		}

		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		let username = user.username;
		if (user.fName !== validation.value.fName || user.lName !== validation.value.lName) {
			const randomNo = Math.floor(Math.random() * 9000) + 1000;
			username = `${validation.value.fName}.${validation.value.lName}.${randomNo}`;
		}

		await UserModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ $set: { ...validation.value, username } },
			{ new: true }
		);

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
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

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
