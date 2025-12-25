import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import connectDatabase from "@/lib/configs/connectDatabase";
import bcrypt from "bcryptjs";
import { checkRoleAccess } from "@/lib/middlewares/authMiddleware";
import { QueryFilter } from "mongoose";

export const GET = async (req: NextRequest) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		await connectDatabase();

		const { searchParams } = new URL(req.url);

		let page = Number(searchParams.get("page") || 1);
		let limit = Number(searchParams.get("limit") || 10);
		const search = searchParams.get("search")?.trim() || "";
		const sort = searchParams.get("sort")?.trim() || "";
		const order = searchParams.get("order") === "asc" ? 1 : -1;
		const role = searchParams.get("role")?.trim() || "";

		if (isNaN(page) || page < 0) {
			page = 1;
		}

		if (isNaN(limit) || limit < 10) {
			limit = 10;
		}

		const searchQuery: QueryFilter<unknown> = { isDeleted: false };
		if (search) {
			searchQuery.$or = [
				{ fullName: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		if (["super_admin", "admin", "editor", "viewer"].includes(role)) {
			searchQuery.role = role;
		}

		const sortQuery: QueryFilter<string> = { createdAt: 1 };
		if (sort) {
			const sortableFields = ["fullName", "email", "createdAt"];
			if (sortableFields.includes(sort)) {
				sortQuery[sort] = order;
			}
		}

		const totalDocuments = await UserModel.countDocuments({ isDeleted: false });
		const filteredDocuments = await UserModel.countDocuments(searchQuery);
		const users = await UserModel.find(searchQuery)
			.sort(sortQuery)
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		return NextResponse.json({ success: true, totalDocuments, filteredDocuments, users }, { status: 200 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const roleGuard = checkRoleAccess(["super_admin", "admin"])(req);
		if (roleGuard) return roleGuard;

		await connectDatabase();
		const body = await req.json();
		const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD as string, 10);

		const randomNo = Math.floor(Math.random() * 9000) + 1000;
		const username = `${body.fName}.${body.lName}.${randomNo}`;

		await UserModel.create({ ...body, password: hashedPassword, username, requiresPasswordChange: true });
		return NextResponse.json({ success: true, message: "User details created successfully." }, { status: 201 });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : "Internal issue.";
		return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
	}
};
