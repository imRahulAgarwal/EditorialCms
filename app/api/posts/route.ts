import connectDatabase from "@/lib/configs/connectDatabase";
import PostModel from "@/lib/models/post";
import sanitizeHtmlUtil from "@/lib/utils/sanitizeHtmlUtil";
import { QueryFilter } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	try {
		await connectDatabase();

		const { searchParams } = new URL(req.url);

		let page = Number(searchParams.get("page") || 1);
		let limit = Number(searchParams.get("limit") || 10);
		const search = searchParams.get("search")?.trim() || "";
		const sort = searchParams.get("sort")?.trim() || "";
		const order = searchParams.get("order") === "asc" ? 1 : -1;

		if (isNaN(page) || page < 0) {
			page = 1;
		}

		if (isNaN(limit) || limit < 10) {
			limit = 10;
		}

		const searchQuery: QueryFilter<unknown> = { isDeleted: false };
		if (search) {
			searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];
		}

		const sortQuery: QueryFilter<string> = { createdAt: 1 };
		if (sort) {
			const sortableFields = ["title", "createdAt"];
			if (sortableFields.includes(sort)) {
				sortQuery[sort] = order;
			}
		}

		const totalDocuments = await PostModel.countDocuments({ isDeleted: false });
		const filteredDocuments = await PostModel.countDocuments(searchQuery);
		const posts = await PostModel.find(searchQuery)
			.select("-htmlContent")
			.sort(sortQuery)
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		return NextResponse.json({ success: true, totalDocuments, filteredDocuments, posts }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const POST = async (req: NextRequest) => {
	try {
		await connectDatabase();
		const body = await req.json();

		const sanititzedHtml = sanitizeHtmlUtil(body.htmlContent);

		await PostModel.create({ ...body, htmlContent: sanititzedHtml });
		return NextResponse.json({ success: true, message: "Post created successfully." }, { status: 201 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
