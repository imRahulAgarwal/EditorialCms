import { createUser, fetchUser, updateUser } from "@/lib/api/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UserFormData = {
	fName: string;
	lName: string;
	email: string;
	role: "admin" | "editor" | "viewer";
};

export default function UserModal({ closeModal, userId = "" }: { closeModal: () => void; userId?: string }) {
	const [formData, setFormData] = useState<UserFormData>({
		fName: "",
		lName: "",
		email: "",
		role: "viewer",
	});

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (userId) {
			updateUser(userId, formData)
				.then((result) => {
					toast.success(result.message);
				})
				.finally(() => closeModal());
		} else {
			createUser(formData)
				.then((result) => {
					toast.success(result.message);
				})
				.finally(() => closeModal());
		}
	};

	useEffect(() => {
		if (userId) {
			fetchUser(userId).then((result) => {
				if (result.success) {
					setFormData({
						fName: result.user.fName,
						lName: result.user.lName,
						email: result.user.email,
						role: result.user.role,
					});
				}
			});
		}
	}, [userId]);

	const handleModalClose = () => {
		setFormData({
			fName: "",
			lName: "",
			email: "",
			role: "viewer",
		});

		closeModal();
	};

	return (
		<>
			{/* Overlay */}
			<div className="fixed inset-0 bg-black/50 z-40" />

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="user-modal-title"
					className="w-full max-w-md rounded-md border border-gray-200 bg-white p-5 shadow-md">
					{/* Header */}
					<div className="mb-4">
						<h2 id="user-modal-title" className="text-lg font-semibold text-gray-900">
							Add User
						</h2>
						<p className="mt-1 text-sm text-gray-600">Fill in the user details below</p>
					</div>

					{/* Form */}
					<form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
						{/* Name Row */}
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="flex flex-col gap-1">
								<label htmlFor="fName" className="text-sm font-medium text-gray-700">
									<span>First Name </span>
									<span className="text-red-600">*</span>
								</label>
								<input
									id="fName"
									type="text"
									className="h-9 rounded-sm border border-gray-300 px-2 text-sm
										focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
									onChange={(e) =>
										setFormData((d) => ({
											...d,
											fName: e.target.value,
										}))
									}
									value={formData.fName}
								/>
							</div>

							<div className="flex flex-col gap-1">
								<label htmlFor="lName" className="text-sm font-medium text-gray-700">
									<span>Last Name </span>
									<span className="text-red-600">*</span>
								</label>
								<input
									id="lName"
									type="text"
									className="h-9 rounded-sm border border-gray-300 px-2 text-sm
										focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
									onChange={(e) =>
										setFormData((d) => ({
											...d,
											lName: e.target.value,
										}))
									}
									value={formData.lName}
								/>
							</div>
						</div>

						{/* Email */}
						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm font-medium text-gray-700">
								<span>Email </span>
								<span className="text-red-600">*</span>
							</label>
							<input
								id="email"
								type="email"
								className="h-9 rounded-sm border border-gray-300 px-2 text-sm
									focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								onChange={(e) =>
									setFormData((d) => ({
										...d,
										email: e.target.value,
									}))
								}
								value={formData.email}
							/>
						</div>

						{/* Role */}
						<div className="flex flex-col gap-1">
							<label htmlFor="role" className="text-sm font-medium text-gray-700">
								<span>Role </span>
								<span className="text-red-600">*</span>
							</label>
							<select
								id="role"
								className="h-9 rounded-sm border border-gray-300 px-2 text-sm bg-white
									focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								value={formData.role}
								onChange={(e) =>
									setFormData((d) => ({
										...d,
										role: e.target.value as UserFormData["role"],
									}))
								}>
								<option value="admin">Admin</option>
								<option value="editor">Editor</option>
								<option value="viewer">Viewer</option>
							</select>
						</div>

						{/* Actions */}
						<div className="mt-4 flex justify-end gap-2">
							<button
								onClick={handleModalClose}
								type="button"
								className="h-9 rounded-sm border border-gray-300 px-4 text-sm
									text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-400">
								Close
							</button>

							<button
								type="submit"
								className="h-9 rounded-sm bg-blue-600 px-4 text-sm font-medium
									text-white hover:bg-blue-700 focus-visible:ring-2
									focus-visible:ring-blue-500">
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
