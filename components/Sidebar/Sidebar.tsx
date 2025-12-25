"use client";

import { RootState } from "@/store";
import clsx from "clsx";
import { Files, Home, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function Sidebar({ sidebarOpen, closeSidebar }: { sidebarOpen: boolean; closeSidebar: () => void }) {
	let navLinks = [
		{ title: "Dashboard", href: "/dashboard", icon: Home, rolesAllowed: ["super_admin", "admin", "editor"] },
		{ title: "Posts", href: "/posts", icon: Files, rolesAllowed: ["super_admin", "admin", "editor", "viewer"] },
		{ title: "Users", href: "/users", icon: Users, rolesAllowed: ["super_admin", "admin"] },
	];

	const authState = useSelector((state: RootState) => state.user);
	const { user } = authState;
	const pathname = usePathname();

	if (!user) {
		return null;
	}

	navLinks = navLinks.filter((navLink) => navLink.rolesAllowed.includes(user!.role));

	return (
		<>
			<nav
				className={clsx(
					"w-64 h-full bg-white border-r border-slate-200 transition-all duration-300",
					sidebarOpen ? "ml-0" : "-ml-64"
				)}
				aria-label="Sidebar navigation">
				{/* Header */}
				<div className="h-16 flex items-center justify-between px-3 border-b border-slate-200">
					<span className="font-medium text-slate-900 truncate">Editorial CMS</span>

					<button
						onClick={() => closeSidebar()}
						className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
						aria-label="Close sidebar">
						<X className="h-5 w-5 text-slate-900" />
					</button>
				</div>

				{/* Navigation */}
				<ul className="flex flex-col gap-1 p-2">
					{navLinks.map(({ title, href, icon: Icon }) => {
						const isActive = pathname === href;

						return (
							<li key={href}>
								<Link
									href={href}
									className={clsx(
										"flex items-center gap-3 rounded-md p-4 text-sm",
										"focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
										isActive
											? "bg-slate-200 text-slate-900"
											: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
									)}
									aria-current={isActive ? "page" : undefined}>
									<Icon className="h-5 w-5 shrink-0" />

									<span>{title}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}
