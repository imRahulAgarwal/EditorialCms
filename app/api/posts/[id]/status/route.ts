import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/lib/configs/connectDatabase";
import PostModel from "@/lib/models/post";
import { TRoute } from "@/types/Route";
import { checkRoleAccess } from "@/lib/middlewares/authMiddleware";

export const PATCH = async (req: NextRequest, { params }: TRoute) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		const { id } = await params;
		await connectDatabase();
		const body = await req.json();

		const post = await PostModel.findOne({ _id: id, isDeleted: false }).select("-htmlContent");
		if (!post) {
			return NextResponse.json({ success: false, error: "Post details not found." }, { status: 404 });
		}

		let publishStatus = "draft";
		if (["archived", "published"].includes(body.publishStatus)) {
			publishStatus = body.publishStatus;
		}

		await PostModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { publishStatus } }, { new: true });
		return NextResponse.json(
			{ success: true, message: "Post publish status updated successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
