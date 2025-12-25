import { JwtPayload, verifyToken } from "@/lib/utils/tokenUtil";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/auth/login", "/auth/login"];
const ALLOWED_FOR_ALL = ["/api/auth/profile", "/api/auth/change-password"];

function isApiRoute(pathname: string) {
	return pathname.startsWith("/api");
}

function deny(req: NextRequest, redirectTo = "/auth/login") {
	if (isApiRoute(req.nextUrl.pathname)) {
		return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
	}
	return NextResponse.redirect(new URL(redirectTo, req.url));
}

export default function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const method = req.method;

	const isPublicPath = PUBLIC_PATHS.some((path) => path === pathname);
	const token = req.cookies.get("token")?.value as string;

	if (isPublicPath && !token) {
		return NextResponse.next();
	}

	if (!isPublicPath && !token) {
		return deny(req);
	}

	let payload: JwtPayload;

	try {
		payload = verifyToken(token);
	} catch {
		return deny(req);
	}

	if (ALLOWED_FOR_ALL.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	const role = payload.role;

	if (role === "super_admin") {
		return NextResponse.next();
	}

	// ---- ADMIN ----
	if (role === "admin") {
		if (pathname.startsWith("/api/users") && (method === "DELETE" || pathname.includes("status"))) {
			return deny(req, "/dashboard");
		}

		if (pathname.startsWith("/api/posts") && method === "DELETE") {
			return deny(req, "/posts");
		}

		return NextResponse.next();
	}

	// ---- EDITOR ----
	if (role === "editor") {
		const allowed =
			pathname.startsWith("/posts") ||
			pathname.startsWith("/api/posts") ||
			pathname.startsWith("/dashboard") ||
			pathname.startsWith("/api/dashboard");

		if (!allowed) return deny(req, "/posts");

		if (pathname.startsWith("/api/posts") && (method === "DELETE" || pathname.includes("status"))) {
			return deny(req, "/posts");
		}

		return NextResponse.next();
	}

	// ---- VIEWER ----
	if (role === "viewer") {
		const allowed =
			(pathname.startsWith("/posts") && !(pathname.includes("new") || pathname.includes("update"))) ||
			pathname.startsWith("/api/posts");
		if (!allowed) return deny(req, "/posts");
		return NextResponse.next();
	}

	return deny(req);
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|assets|public).*)"],
};
