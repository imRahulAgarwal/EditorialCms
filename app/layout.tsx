import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/store/providers/UserProvider";

export const metadata: Metadata = {
	title: "Editorial CMS",
	description: "A role-based Editorial CMS with WYSIWYG editor.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<UserProvider>
			<html lang="en" className="h-full">
				<body className={`antialiased h-full w-full`}>
					{children}
					<ToastContainer
						position="bottom-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="light"
					/>
				</body>
			</html>
		</UserProvider>
	);
}
