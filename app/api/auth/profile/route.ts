import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import connectDatabase from "@/lib/configs/connectDatabase";
import { verifyToken } from "@/lib/utils/tokenUtil";

export const GET = async (req: NextRequest) => {
	try {
		const token = req.cookies.get("token")?.value as string;
		const payload = verifyToken(token);
		const id = payload.id;

		await connectDatabase();
		const user = await UserModel.findOne({ _id: id, isDeleted: false });
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		const userDataToReturn = { name: user.fullName, email: user.email, role: user.role };
		return NextResponse.json({ success: true, user: userDataToReturn }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
