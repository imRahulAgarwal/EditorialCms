"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import AuthInitializer from "@/store/initializers/AuthInitializer";
import { useEffect, useState } from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			<AuthInitializer />
			<div className="flex h-full w-full">
				<Sidebar sidebarOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
				<main className="flex-1 flex flex-col">
					<Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
					<div className="flex-1 p-4 flex flex-col bg-slate-50">{children}</div>
				</main>
			</div>
		</>
	);
}
