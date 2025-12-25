"use client";

import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

type ChangePasswordModalProps = {
	isOpen: boolean;
	onSubmit?: (data: ChangePasswordFormData) => Promise<void>;
};

export default function ChangePasswordModal({ isOpen, onSubmit }: ChangePasswordModalProps) {
	const [formData, setFormData] = useState<ChangePasswordFormData>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("New password and confirm password do not match");
			return;
		}

		try {
			if (onSubmit) {
				await onSubmit(formData);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to change password.";
			toast.error(errorMessage);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-5 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					{/* Current Password */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							Current Password <span className="text-red-600">*</span>
						</label>
						<div className="flex">
							<input
								type={showPassword.current ? "text" : "password"}
								className="h-9 flex-1 rounded-l-sm border border-gray-300 px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								required
								onChange={(e) => setFormData((d) => ({ ...d, currentPassword: e.target.value }))}
							/>
							<button
								type="button"
								className="text-sm flex items-center justify-center h-9 w-10 rounded-r-sm border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))}>
								{showPassword.current ? <Unlock /> : <Lock />}
							</button>
						</div>
					</div>

					{/* New Password */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							New Password <span className="text-red-600">*</span>
						</label>
						<div className="flex">
							<input
								type={showPassword.new ? "text" : "password"}
								className="h-9 flex-1 rounded-l-sm border border-gray-300 px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								required
								onChange={(e) => setFormData((d) => ({ ...d, newPassword: e.target.value }))}
							/>
							<button
								type="button"
								className="text-sm flex items-center justify-center h-9 w-10 rounded-r-sm border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}>
								{showPassword.new ? <Unlock /> : <Lock />}
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							Confirm Password <span className="text-red-600">*</span>
						</label>
						<div className="flex">
							<input
								type={showPassword.confirm ? "text" : "password"}
								className="h-9 flex-1 rounded-l-sm border border-gray-300 px-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								required
								onChange={(e) =>
									setFormData((d) => ({
										...d,
										confirmPassword: e.target.value,
									}))
								}
							/>
							<button
								type="button"
								className="text-sm flex items-center justify-center h-9 w-10 rounded-r-sm border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}>
								{showPassword.confirm ? <Unlock /> : <Lock />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						className="mt-2 h-9 w-full rounded-sm bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
						Update Password
					</button>
				</form>
			</div>
		</div>
	);
}
