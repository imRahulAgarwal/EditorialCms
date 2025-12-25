"use client";

import { deleteUser, fetchUsers, toggleActiveStatusUser } from "@/lib/api/user";
import { flexRender, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import UserModal from "@/components/Users/Modal";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

type User = {
	_id: string;
	fullName?: string;
	email?: string;
	role?: string;
	createdAt?: Date;
	isActive: boolean;
};

const ROLES = ["all", "viewer", "editor", "admin", "super_admin"];

export default function UsersTable() {
	const role = useSelector((state: RootState) => state.user.user?.role);
	const [data, setData] = useState<User[]>([]);
	const [totalDocuments, setTotalDocuments] = useState(0);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [showFilter, setShowFilter] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [userIdToEdit, setUserIdToEdit] = useState("");

	useEffect(() => {
		fetchUsers({
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
			search,
			role: roleFilter !== "all" ? roleFilter : undefined,
			sort: sorting[0]?.id,
			order: sorting[0]?.desc === true ? "desc" : "asc",
		}).then((res) => {
			if (res.success) {
				setData(res.users ?? []);
				setTotalDocuments(res.filteredDocuments ?? 0);
			}
		});
	}, [pagination, sorting, search, roleFilter]);

	const table = useReactTable({
		data,
		columns: [
			{
				header: "Name",
				accessorKey: "fullName",
				cell: ({ getValue }) => getValue() || "-",
			},
			{
				header: "Email",
				accessorKey: "email",
				cell: ({ getValue }) => getValue() || "-",
			},
			{
				header: "Role",
				accessorKey: "role",
				cell: ({ getValue }) => {
					const role = getValue<string>();
					if (role === "super_admin") {
						return "Super Admin";
					} else if (role === "admin") {
						return "Admin";
					} else if (role === "editor") {
						return "Editor";
					} else {
						return "Viewer";
					}
				},
			},
			{
				header: "Created At",
				accessorKey: "createdAt",
				cell: ({ getValue }) => {
					const date = getValue<Date>();
					return date ? dayjs(date).format("DD-MMM-YYYY") : "-";
				},
			},
			{
				header: "Active",
				accessorKey: "isActive",
				cell: ({ row }) =>
					role === "super_admin" ? (
						<input
							type="checkbox"
							checked={row.original.isActive}
							onChange={() => toggleActiveStatusUser(row.original._id)}
							aria-label="Toggle active status"
						/>
					) : (
						<span>{row.original.isActive ? "Yes" : "No"}</span>
					),
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-2">
						{(role === "super_admin" || role === "admin") && (
							<button
								onClick={() => {
									setUserIdToEdit(row.original._id);
									setShowModal(true);
								}}
								className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
								Update
							</button>
						)}

						{role === "super_admin" && (
							<button
								onClick={() => deleteUser(row.original._id)}
								className="rounded-md px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700">
								Delete
							</button>
						)}
					</div>
				),
			},
		],
		getCoreRowModel: getCoreRowModel(),
		pageCount: totalDocuments,
		state: { pagination, sorting },
		manualPagination: true,
		manualSorting: true,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
	});

	if (!role || role === "editor" || role === "viewer") {
		return null;
	}

	return (
		<div className="bg-white border border-slate-200 rounded-md p-4">
			{/* Top controls */}
			<div className="mb-4 flex flex-wrap gap-3 justify-between items-center">
				<div className="flex gap-2">
					<input
						value={search}
						onChange={(e) => {
							setPagination({ ...pagination, pageIndex: 0 });
							setSearch(e.target.value);
						}}
						placeholder="Search users"
						className="rounded-md border border-slate-200 px-3 py-2 text-sm"
					/>

					<div className="relative">
						<button
							onClick={() => setShowFilter((v) => !v)}
							className="rounded-md px-3 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
							Filter
						</button>

						{showFilter && (
							<div className="absolute z-10 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-sm">
								{ROLES.map((role) => (
									<button
										key={role}
										onClick={() => {
											setRoleFilter(role);
											setPagination({
												...pagination,
												pageIndex: 0,
											});
											setShowFilter(false);
										}}
										className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50">
										{role}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{(role === "super_admin" || role === "admin") && (
					<button
						onClick={() => {
							setUserIdToEdit("");
							setShowModal(true);
						}}
						className="rounded-md px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
						Add New User
					</button>
				)}
			</div>

			{/* Table info */}
			<p className="mb-2 text-sm text-slate-500">
				Showing {data.length ? pagination.pageIndex * pagination.pageSize + 1 : 0}–
				{pagination.pageIndex * pagination.pageSize + data.length} of {totalDocuments}
			</p>

			{showModal && <UserModal closeModal={() => setShowModal(false)} userId={userIdToEdit} />}

			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id} className="border-b border-slate-200">
								{hg.headers.map((header) => (
									<th
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										className="px-4 py-3 text-left text-sm font-semibold text-slate-900 cursor-pointer">
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody>
						{data.length ? (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={table.getHeaderGroups()[0].headers.length}
									className="px-4 py-6 text-center text-sm text-slate-500">
									No users found
								</td>
							</tr>
						)}
					</tbody>

					<tfoot>
						<tr>
							<td colSpan={6} className="pt-4">
								<div className="flex gap-2">
									<button
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50">
										Prev
									</button>
									<button
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50">
										Next
									</button>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
