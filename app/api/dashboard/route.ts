import connectDatabase from "@/lib/configs/connectDatabase";
import PostModel from "@/lib/models/post";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	try {
		await connectDatabase();

		const { searchParams } = new URL(req.url);

		const publishStatus = searchParams.get("status")?.trim().toLowerCase() || "";

		if (!["draft", "archived", "published"].includes(publishStatus)) {
			return NextResponse.json({ success: false, error: "Invalid post publish status." }, { status: 400 });
		}

		const searchQuery = { isDeleted: false, publishStatus };

		const totalDocuments = await PostModel.countDocuments(searchQuery);

		return NextResponse.json({ success: true, totalDocuments }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
