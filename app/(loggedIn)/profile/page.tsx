"use client";

import { changePassword } from "@/lib/api/auth";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ProfilePage() {
	const authState = useSelector((state: RootState) => state.user);
	const { user } = authState;

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleChangePassword = (e: React.FormEvent) => {
		e.preventDefault();

		if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
			return;
		}

		changePassword({ currentPassword, newPassword, confirmPassword }).then((result) => {
			toast.success(result.message);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setShowPassword(false);
		});
	};

	return (
		<div className="h-full bg-white border border-slate-200 rounded-md p-6 grid lg:grid-cols-3">
			<div className="lg:border-r md:border-slate-200 lg:col-span-1">
				<h1 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Profile</h1>

				{/* Profile info */}
				<div className="mt-2 flex flex-col gap-4">
					<div>
						<p className="text-sm text-slate-500">Name</p>
						<p className="text-slate-900">{user?.name}</p>
					</div>

					<div>
						<p className="mt-2 text-sm text-slate-500">Email</p>
						<p className="text-slate-900">{user?.email}</p>
					</div>

					<div>
						<p className="mt-2 text-sm text-slate-500">Role</p>
						<p className="text-slate-900">{user?.role}</p>
					</div>
				</div>
			</div>

			<div className="lg:col-span-2">
				<h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 px-4">
					Change Password
				</h2>

				{/* Change password */}
				<form onSubmit={handleChangePassword} className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm text-slate-500">Current Password</label>
						<input
							type={showPassword ? "text" : "password"}
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="h-9 rounded-md border border-slate-200 px-3 text-sm
						focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm text-slate-500">New Password</label>
						<input
							type={showPassword ? "text" : "password"}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="h-9 rounded-md border border-slate-200 px-3 text-sm
						focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm text-slate-500">Confirm New Password</label>
						<input
							type={showPassword ? "text" : "password"}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="h-9 rounded-md border border-slate-200 px-3 text-sm
						focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
						/>
					</div>

					<div className="flex justify-between items-center">
						<div className="flex items-center gap-1">
							<input
								type="checkbox"
								id="showPasswordCheckbox"
								checked={showPassword ? true : false}
								onChange={() => setShowPassword((prev) => !prev)}
							/>
							<label htmlFor="showPasswordCheckbox">Show Password</label>
						</div>

						<button
							type="submit"
							className="rounded-md px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
							Update Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
