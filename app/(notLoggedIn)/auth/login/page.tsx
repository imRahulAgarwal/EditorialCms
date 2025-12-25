"use client";

import { login } from "@/lib/api/auth";
import { loginAction } from "@/store/slices/userSlice";
import { Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type LoginFormData = {
	email: string;
	password: string;
};

export default function Login() {
	const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const router = useRouter();
	const dispatch = useDispatch();

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(formData)
			.then((result) => {
				dispatch(loginAction(result.user));
				toast.success(result.message);
				router.replace("/dashboard");
			})
			.catch((error) => {
				let errorMessage = "";
				if (error.name === "AxiosError") {
					errorMessage = error.response?.data?.error;
				} else {
					errorMessage = error?.message || "Internal Issue";
				}

				toast.error(errorMessage);
			});
	};

	return (
		<div className="h-full w-full flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-5 shadow-sm">
				<div className="mb-4 text-center">
					<h1 className="text-lg font-semibold text-gray-900">Editorial CMS</h1>
					<p className="mt-1 text-sm text-gray-600">Login to start your session.</p>
				</div>
				<form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label htmlFor="email" className="text-sm font-medium text-gray-700">
							<span>Email </span>
							<span className="text-red-600">*</span>
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="h-9 rounded-sm border border-gray-300 px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
							onChange={(e) => setFormData((data) => ({ ...data, email: e.target.value }))}
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="password" className="text-sm font-medium text-gray-700">
							<span>Password </span>
							<span className="text-red-600">*</span>
						</label>
						<div className="flex">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								className="h-9 flex-1 rounded-l-sm border border-gray-300 px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
							/>
							<button
								className="text-sm flex items-center justify-center h-9 w-10 rounded-r-sm border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								aria-label={showPassword ? "Hide Password" : "Show Password"}
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}>
								{showPassword ? <Unlock /> : <Lock />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						className="h-9 mt-2 rounded-sm bg-blue-600 font-medium hover:bg-blue-700 text-white w-full hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
