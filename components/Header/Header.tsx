"use client";

import Link from "next/link";
import { Menu, UserCircle, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/app/actions/logout";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
	const authState = useSelector((state: RootState) => state.user);
	const { user } = authState;

	const router = useRouter();

	async function handleLogout() {
		await logout();
		router.replace("/auth/login");
		toast.success("User logged out!");
	}

	return (
		<header className="p-4 h-16 border-b border-slate-200 bg-white">
			<div className="flex h-full items-center justify-between">
				<button
					onClick={toggleSidebar}
					aria-label="Toggle sidebar"
					className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
					<Menu className="text-slate-900" />
				</button>

				<nav className="flex items-center gap-3">
					<Link
						href="/profile"
						className="flex items-center gap-1 text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded px-2 py-1"
						aria-label="Profile">
						<UserCircle className="h-5 w-5" />
						<span className="">{user?.name}</span>
					</Link>

					<button
						onClick={handleLogout}
						className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
						aria-label="Logout">
						<LogOut className="h-5 w-5" />
					</button>
				</nav>
			</div>
		</header>
	);
}
