import connectDatabase from "@/lib/configs/connectDatabase";
import UserModel from "@/lib/models/user";
import { comparePassword } from "@/lib/utils/passwordUtil";
import { signToken } from "@/lib/utils/tokenUtil";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	try {
		await connectDatabase();
		const body = await req.json();

		const { email, password } = body;
		const user = await UserModel.findOne({ email, isDeleted: false, isActive: true }).select("+password");
		if (!user) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		const isValidPassword = await comparePassword(user.password, password);
		if (!isValidPassword) {
			return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
		}

		const token = signToken({ id: user._id.toString(), role: user.role }, 24 * 60 * 60 * 1000);
		const res = NextResponse.json(
			{
				success: true,
				user: { name: user.fullName, email: user.email, role: user.role },
				message: "User logged in successfully.",
				requiresPasswordChange: user.requiresPasswordChange ?? false,
			},
			{ status: 200 }
		);
		res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });

		return res;
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
