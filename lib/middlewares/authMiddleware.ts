import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/tokenUtil";

export const checkRoleAccess = (allowedRoles: string[]) => (req: NextRequest) => {
	const token = req.cookies.get("token")?.value;
	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const decodedToken = verifyToken(token);

	if (!allowedRoles.includes(decodedToken?.role)) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	return null;
};
