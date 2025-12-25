"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import AuthInitializer from "@/store/initializers/AuthInitializer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "@/app/actions/logout";
import ChangePasswordModal from "@/components/ChangePassword/Modal";
import { changePassword } from "@/lib/api/auth";
import { RootState } from "@/store";
import { TChangePassword } from "@/types/Auth";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const authState = useSelector((state: RootState) => state.user);
	const router = useRouter();

	useEffect(() => {
		const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handlePasswordChange = async (data: TChangePassword) => {
		try {
			const result = await changePassword(data);
			console.log(result);
			toast.success(result.message);
			await logout();
			router.replace("/auth/login");
		} catch (error: unknown) {
			let errorMessage = "Internal issue.";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error ?? error.response?.data?.message ?? "Request failed.";
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			toast.error(errorMessage);
		}
	};

	return (
		<>
			<AuthInitializer />

			{authState.requiresPasswordChange && <ChangePasswordModal isOpen={true} onSubmit={handlePasswordChange} />}

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
