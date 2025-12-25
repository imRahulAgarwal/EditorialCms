import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/lib/configs/connectDatabase";
import PostModel from "@/lib/models/post";
import sanitizeHtmlUtil from "@/lib/utils/sanitizeHtmlUtil";
import { TRoute } from "@/types/Route";
import { postSchema } from "@/lib/schemas/post";
import validateObjectId from "@/lib/schemas/objectId";

export const GET = async (req: NextRequest, { params }: TRoute) => {
	try {
		const { id } = await params;
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

		await connectDatabase();
		const post = await PostModel.findOne({ _id: id, isDeleted: false }).lean();
		if (!post) {
			return NextResponse.json({ success: false, error: "Post details not found." }, { status: 404 });
		}

		return NextResponse.json({ success: true, post });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const PUT = async (req: NextRequest, { params }: TRoute) => {
	try {
		const { id } = await params;
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

		await connectDatabase();
		const body = await req.json();
		const validation = postSchema.validate(body);
		if (validation.error) {
			const errors = validation.error.details.map((issue) => issue.message);
			return NextResponse.json({ success: false, error: errors[0] }, { status: 422 });
		}

		const post = await PostModel.findOne({ _id: id, isDeleted: false });
		if (!post) {
			return NextResponse.json({ success: false, error: "Post details not found." }, { status: 404 });
		}

		const sanititzedHtml = sanitizeHtmlUtil(validation.value.htmlContent);
		await PostModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ $set: { ...validation.value, htmlContent: sanititzedHtml } },
			{ new: true }
		);

		return NextResponse.json({ success: true, message: "Post updated successfully." }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const DELETE = async (req: NextRequest, { params }: TRoute) => {
	try {
		const { id } = await params;
		if (!id || !validateObjectId(id)) {
			return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
		}

		await connectDatabase();
		const post = await PostModel.findOne({ _id: id, isDeleted: false }).select("-htmlContent");
		if (!post) {
			return NextResponse.json({ success: false, error: "User details not found." }, { status: 404 });
		}

		post.isDeleted = true;
		await post.save();

		return NextResponse.json({ success: true, message: "Post updated successfully." }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
