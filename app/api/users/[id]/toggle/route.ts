import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import connectDatabase from "@/lib/configs/connectDatabase";
import { checkRoleAccess } from "@/lib/middlewares/authMiddleware";
import { TRoute } from "@/types/Route";

export const PATCH = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		await connectDatabase();

		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		await UserModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ $set: { isActive: !user.isActive } },
			{ new: true }
		);

		return NextResponse.json(
			{ success: true, message: "User active status updated successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
